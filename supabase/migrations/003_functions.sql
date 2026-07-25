-- Database Functions
-- Replaces Express controllers for server-side logic

-- ============================================
-- START TOURNAMENT
-- Changes status from OPEN to RUNNING
-- ============================================

CREATE OR REPLACE FUNCTION start_tournament(p_tournament_id UUID)
RETURNS JSON AS $$
DECLARE
  v_tournament RECORD;
BEGIN
  -- Get tournament
  SELECT * INTO v_tournament
  FROM tournaments
  WHERE id = p_tournament_id;

  -- Check if tournament exists
  IF v_tournament IS NULL THEN
    RETURN json_build_object('error', 'Tournament not found.');
  END IF;

  -- Check if status is OPEN
  IF v_tournament.status != 'OPEN' THEN
    RETURN json_build_object('error', 'Tournament must be OPEN to start.');
  END IF;

  -- Update status
  UPDATE tournaments
  SET status = 'RUNNING'
  WHERE id = p_tournament_id;

  RETURN json_build_object(
    'message', 'Tournament started successfully.',
    'tournament', json_build_object(
      'id', v_tournament.id,
      'name', v_tournament.name,
      'status', 'RUNNING'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FINISH TOURNAMENT
-- Changes status from RUNNING to FINISHED
-- ============================================

CREATE OR REPLACE FUNCTION finish_tournament(p_tournament_id UUID)
RETURNS JSON AS $$
DECLARE
  v_tournament RECORD;
BEGIN
  -- Get tournament
  SELECT * INTO v_tournament
  FROM tournaments
  WHERE id = p_tournament_id;

  -- Check if tournament exists
  IF v_tournament IS NULL THEN
    RETURN json_build_object('error', 'Tournament not found.');
  END IF;

  -- Check if status is RUNNING
  IF v_tournament.status != 'RUNNING' THEN
    RETURN json_build_object('error', 'Tournament must be RUNNING to finish.');
  END IF;

  -- Update status
  UPDATE tournaments
  SET status = 'FINISHED'
  WHERE id = p_tournament_id;

  RETURN json_build_object(
    'message', 'Tournament finished successfully.',
    'tournament', json_build_object(
      'id', v_tournament.id,
      'name', v_tournament.name,
      'status', 'FINISHED'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- UPDATE MATCH RESULT
-- Updates match status and winner, recalculates ranking
-- ============================================

CREATE OR REPLACE FUNCTION update_match_result(
  p_match_id UUID,
  p_status TEXT,
  p_winning_participant_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_match RECORD;
  v_tournament_id UUID;
BEGIN
  -- Get match
  SELECT * INTO v_match
  FROM matches
  WHERE id = p_match_id;

  -- Check if match exists
  IF v_match IS NULL THEN
    RETURN json_build_object('error', 'Match not found.');
  END IF;

  v_tournament_id := v_match.tournament_id;

  -- Update match
  UPDATE matches
  SET status = p_status::match_status,
      winning_participant_id = p_winning_participant_id
  WHERE id = p_match_id;

  -- If match is completed, update rankings
  IF p_status = 'COMPLETED' THEN
    -- Update winner ranking
    INSERT INTO rankings (tournament_id, entity_name, entity_type, score, wins, games_played)
    VALUES (
      v_tournament_id,
      (SELECT name FROM teams WHERE id = p_winning_participant_id),
      'team',
      3,
      1,
      1
    )
    ON CONFLICT DO NOTHING;

    -- Update winner stats
    UPDATE rankings
    SET score = score + 3,
        wins = wins + 1,
        games_played = games_played + 1
    WHERE tournament_id = v_tournament_id
    AND entity_name = (
      SELECT name FROM teams WHERE id = p_winning_participant_id
    );

    -- Update loser ranking
    INSERT INTO rankings (tournament_id, entity_name, entity_type, score, losses, games_played)
    VALUES (
      v_tournament_id,
      (SELECT name FROM teams WHERE id = CASE
        WHEN p_winning_participant_id = v_match.team_a_id THEN v_match.team_b_id
        ELSE v_match.team_a_id
      END),
      'team',
      0,
      1,
      1
    )
    ON CONFLICT DO NOTHING;

    -- Update loser stats
    UPDATE rankings
    SET losses = losses + 1,
        games_played = games_played + 1
    WHERE tournament_id = v_tournament_id
    AND entity_name = (
      SELECT name FROM teams WHERE id = CASE
        WHEN p_winning_participant_id = v_match.team_a_id THEN v_match.team_b_id
        ELSE v_match.team_a_id
      END
    );
  END IF;

  RETURN json_build_object(
    'message', 'Match result updated successfully.',
    'match', json_build_object(
      'id', v_match.id,
      'status', p_status,
      'winning_participant_id', p_winning_participant_id
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- GET GLOBAL RANKINGS
-- Top 50 players/teams grouped by entity
-- ============================================

CREATE OR REPLACE FUNCTION get_global_rankings()
RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'rankings', json_agg(
        json_build_object(
          'entity_name', entity_name,
          'entity_type', entity_type,
          'total_score', total_score,
          'total_wins', total_wins,
          'total_losses', total_losses,
          'tournament_count', tournament_count
        )
        ORDER BY total_score DESC
      )
    )
    FROM (
      SELECT
        entity_name,
        entity_type,
        SUM(score) AS total_score,
        SUM(wins) AS total_wins,
        SUM(losses) AS total_losses,
        COUNT(*) AS tournament_count
      FROM rankings
      GROUP BY entity_name, entity_type
      ORDER BY SUM(score) DESC
      LIMIT 50
    ) sub
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- GET TOURNAMENT RANKINGS
-- Rankings for a specific tournament
-- ============================================

CREATE OR REPLACE FUNCTION get_tournament_rankings(p_tournament_id UUID)
RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'tournament_id', p_tournament_id,
      'rankings', json_agg(
        json_build_object(
          'id', r.id,
          'entity_name', r.entity_name,
          'entity_type', r.entity_type,
          'score', r.score,
          'wins', r.wins,
          'losses', r.losses,
          'games_played', r.games_played
        )
        ORDER BY r.score DESC
      )
    )
    FROM rankings r
    WHERE r.tournament_id = p_tournament_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
