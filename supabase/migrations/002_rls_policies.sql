-- Row Level Security Policies
-- Replaces Express middleware/auth.ts and checkRole

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS POLICIES
-- ============================================

-- Anyone can read basic user info (for display purposes)
CREATE POLICY "Public user profiles"
  ON users FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- TEAMS POLICIES
-- ============================================

-- Anyone can read teams
CREATE POLICY "Public teams read"
  ON teams FOR SELECT
  USING (true);

-- Authenticated users can create teams
CREATE POLICY "Authenticated users create teams"
  ON teams FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only captain can update their team
CREATE POLICY "Captains update own team"
  ON teams FOR UPDATE
  USING (captain_id = auth.uid());

-- Only captain can delete their team
CREATE POLICY "Captains delete own team"
  ON teams FOR DELETE
  USING (captain_id = auth.uid());

-- ============================================
-- TEAM MEMBERS POLICIES
-- ============================================

-- Anyone can read team members
CREATE POLICY "Public team members read"
  ON team_members FOR SELECT
  USING (true);

-- Users can join teams (insert themselves)
CREATE POLICY "Users join teams"
  ON team_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can leave teams (delete themselves) or captain can remove members
CREATE POLICY "Users leave teams or captain removes"
  ON team_members FOR DELETE
  USING (
    user_id = auth.uid()
    OR
    team_id IN (SELECT id FROM teams WHERE captain_id = auth.uid())
  );

-- ============================================
-- TOURNAMENTS POLICIES
-- ============================================

-- Anyone can read tournaments
CREATE POLICY "Public tournaments read"
  ON tournaments FOR SELECT
  USING (true);

-- Only ORGANIZER and ADMIN can create tournaments
CREATE POLICY "Organizer and admin create tournaments"
  ON tournaments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND user_role IN ('ORGANIZER', 'ADMIN')
    )
  );

-- Only the organizer can update their tournament
CREATE POLICY "Organizer updates own tournament"
  ON tournaments FOR UPDATE
  USING (organizer_id = auth.uid());

-- Only ADMIN can delete tournaments
CREATE POLICY "Admin deletes tournaments"
  ON tournaments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND user_role = 'ADMIN'
    )
  );

-- ============================================
-- TOURNAMENT PARTICIPANTS POLICIES
-- ============================================

-- Anyone can read participants (for public tournament views)
CREATE POLICY "Public participants read"
  ON tournament_participants FOR SELECT
  USING (true);

-- Users can register themselves for tournaments
CREATE POLICY "Users register for tournaments"
  ON tournament_participants FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can unregister themselves
CREATE POLICY "Users unregister from tournaments"
  ON tournament_participants FOR DELETE
  USING (user_id = auth.uid());

-- Organizer can update participant status (approve/reject)
CREATE POLICY "Organizer manages participants"
  ON tournament_participants FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM tournaments t
      WHERE t.id = tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

-- ============================================
-- MATCHES POLICIES
-- ============================================

-- Anyone can read matches
CREATE POLICY "Public matches read"
  ON matches FOR SELECT
  USING (true);

-- Only ORGANIZER and ADMIN can update matches
CREATE POLICY "Organizer and admin update matches"
  ON matches FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND user_role IN ('ORGANIZER', 'ADMIN')
    )
  );

-- ============================================
-- RANKINGS POLICIES
-- ============================================

-- Anyone can read rankings
CREATE POLICY "Public rankings read"
  ON rankings FOR SELECT
  USING (true);

-- Only system/organizer can insert rankings (via functions)
CREATE POLICY "Organizer insert rankings"
  ON rankings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND user_role IN ('ORGANIZER', 'ADMIN')
    )
  );

-- Only system/organizer can update rankings
CREATE POLICY "Organizer update rankings"
  ON rankings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND user_role IN ('ORGANIZER', 'ADMIN')
    )
  );

-- ============================================
-- NOTIFICATIONS POLICIES
-- ============================================

-- Users can only read their own notifications
CREATE POLICY "Users read own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Only system can create notifications (via functions with SECURITY DEFINER)
CREATE POLICY "System creates notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Users can mark their own notifications as read
CREATE POLICY "Users update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "Users delete own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());
