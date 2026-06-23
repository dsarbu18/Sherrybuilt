/**
 * Portfolio Admin — protected by Supabase Auth + admin_users table.
 * Access at: https://sheridanbuilt.ca/#/admin
 *
 * Security:
 *  - Requires a valid Supabase Auth session (email + password login)
 *  - Session JWT is sent to the Edge Function on every sync request
 *  - Edge Function validates the JWT AND checks admin_users table server-side
 *  - Unauthenticated visitors see only a login form — no admin UI
 */

import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Button, Card, CardContent,
  TextField, CircularProgress,
} from '@mui/material';
import {
  RefreshCw, CheckCircle2, AlertCircle, ImageIcon,
  SkipForward, Upload, LogOut, Lock,
} from 'lucide-react';
import { supabase } from '../../../utils/supabase/client';
import { projectId } from '../../../utils/supabase/info';
import type { Session } from '@supabase/supabase-js';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SyncResult {
  found: number;
  inserted: number;
  skipped: number;
}

type SyncStatus = 'idle' | 'loading' | 'success' | 'error';
type AuthState = 'checking' | 'unauthenticated' | 'authenticated';

// ─── Shared styles ────────────────────────────────────────────────────────────

const INPUT_SX = {
  '& .MuiFilledInput-root': {
    background: 'rgba(245, 239, 224, 0.05)',
    border: '1px solid rgba(212, 149, 42, 0.2)',
    borderRadius: 0,
    '&:hover': { background: 'rgba(245, 239, 224, 0.08)', borderColor: 'rgba(212, 149, 42, 0.4)' },
    '&.Mui-focused': { background: 'rgba(245, 239, 224, 0.08)', borderColor: '#D4952A' },
    '&::before, &::after': { display: 'none' },
  },
  '& .MuiInputLabel-root': { color: '#E8DFC8' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#D4952A' },
  '& .MuiFilledInput-input': { color: '#F5EFE0' },
};

// ─── Login form ───────────────────────────────────────────────────────────────

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });

    if (signInErr) {
      setError(signInErr.message);
      setLoading(false);
    } else {
      onSuccess();
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#1C1C1C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '420px' }}>
        {/* Icon */}
        <Box sx={{ textAlign: 'center', marginBottom: '40px' }}>
          <Box
            sx={{
              width: '56px',
              height: '56px',
              border: '1px solid rgba(212, 149, 42, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Lock size={24} style={{ color: '#D4952A' }} />
          </Box>
          <Typography
            variant="overline"
            sx={{
              color: '#D4952A',
              fontSize: '0.8rem',
              letterSpacing: '0.3em',
              fontWeight: 600,
              display: 'block',
              marginBottom: '8px',
              fontFamily: "'Barlow', sans-serif",
            }}
          >
            ADMIN ACCESS
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              color: '#F5EFE0',
              fontSize: '2rem',
            }}
          >
            Sheridan Built
          </Typography>
        </Box>

        <Card
          sx={{
            background: 'rgba(28, 28, 28, 0.8)',
            border: '1px solid rgba(212, 149, 42, 0.25)',
            borderRadius: 0,
          }}
        >
          <CardContent sx={{ padding: '36px !important' }}>
            <form onSubmit={handleLogin}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  variant="filled"
                  sx={INPUT_SX}
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  variant="filled"
                  sx={INPUT_SX}
                />

                {error && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} style={{ color: '#E05555', flexShrink: 0 }} />
                    <Typography sx={{ color: '#E05555', fontSize: '0.85rem', fontFamily: "'Barlow', sans-serif" }}>
                      {error}
                    </Typography>
                  </Box>
                )}

                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{
                    background: loading ? 'rgba(212, 149, 42, 0.4)' : '#D4952A',
                    color: '#1C1C1C',
                    padding: '14px',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    fontSize: '0.85rem',
                    borderRadius: 0,
                    fontFamily: "'Barlow', sans-serif",
                    marginTop: '4px',
                    '&:hover:not(:disabled)': { background: '#E8B050' },
                  }}
                >
                  {loading ? <CircularProgress size={20} sx={{ color: '#1C1C1C' }} /> : 'Sign In'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

// ─── Admin panel ──────────────────────────────────────────────────────────────

function AdminPanel({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [result, setResult] = useState<SyncResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSync() {
    setSyncStatus('loading');
    setResult(null);
    setErrorMsg(null);

    try {
      // Send the user's real session JWT — the Edge Function validates it server-side
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/sync-portfolio-images`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // session.access_token is the signed JWT for this authenticated user
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? `Server error ${res.status}`);
      }

      setResult(data as SyncResult);
      setSyncStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
      setSyncStatus('error');
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    onLogout();
  }

  return (
    <Box sx={{ background: '#1C1C1C', minHeight: '100vh', padding: { xs: '60px 24px', md: '80px 60px' } }}>
      <Container maxWidth="md">

        {/* Header row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: '#D4952A',
                fontSize: '0.8rem',
                letterSpacing: '0.3em',
                fontWeight: 600,
                display: 'block',
                marginBottom: '12px',
                fontFamily: "'Barlow', sans-serif",
              }}
            >
              ADMIN · AUTHENTICATED
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: { xs: '2.5rem', md: '3.2rem' },
                color: '#F5EFE0',
                lineHeight: 1.2,
              }}
            >
              Portfolio{' '}
              <Box component="span" sx={{ color: '#D4952A' }}>
                Admin
              </Box>
            </Typography>
            <Typography
              sx={{
                color: '#6B6B6B',
                fontSize: '0.85rem',
                fontFamily: "'Barlow', sans-serif",
                marginTop: '8px',
              }}
            >
              Signed in as {session.user.email}
            </Typography>
          </Box>

          <Button
            onClick={handleLogout}
            startIcon={<LogOut size={16} />}
            sx={{
              background: 'transparent',
              color: '#E8DFC8',
              border: '1px solid rgba(212, 149, 42, 0.3)',
              padding: '10px 20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              borderRadius: 0,
              fontFamily: "'Barlow', sans-serif",
              '&:hover': { background: 'rgba(212, 149, 42, 0.08)', borderColor: '#D4952A', color: '#D4952A' },
            }}
          >
            Sign Out
          </Button>
        </Box>

        {/* Instructions */}
        <Card
          sx={{
            background: 'rgba(245, 239, 224, 0.03)',
            border: '1px solid rgba(212, 149, 42, 0.2)',
            borderRadius: 0,
            marginBottom: '40px',
          }}
        >
          <CardContent sx={{ padding: '32px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Upload size={20} style={{ color: '#D4952A', flexShrink: 0 }} />
              <Typography
                sx={{
                  color: '#F5EFE0',
                  fontFamily: "'Libre Baskerville', serif",
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              >
                Before syncing — upload your images
              </Typography>
            </Box>
            <Box
              component="ol"
              sx={{
                color: '#E8DFC8',
                fontFamily: "'Barlow', sans-serif",
                fontSize: '0.95rem',
                lineHeight: 2,
                paddingLeft: '20px',
                margin: 0,
              }}
            >
              <li>
                Go to{' '}
                <Box
                  component="a"
                  href={`https://supabase.com/dashboard/project/${projectId}/storage/buckets/portfolio`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: '#D4952A', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  Supabase Storage → portfolio bucket
                </Box>
              </li>
              <li>
                Upload images into the correct folder:
                <Box component="ul" sx={{ listStyle: 'disc', paddingLeft: '20px', color: '#D4952A', marginTop: '4px' }}>
                  {['Exterior', 'Interior', 'Basements', 'Kitchens', 'Bathrooms', 'Decks'].map((f) => (
                    <li key={f}>
                      <Box component="span" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        portfolio/{f}/
                      </Box>
                      <Box component="span" sx={{ color: '#E8DFC8', fontFamily: "'Barlow', sans-serif" }}>
                        {' '}→ <strong>{f}</strong>
                      </Box>
                    </li>
                  ))}
                </Box>
              </li>
              <li>Click <strong style={{ color: '#D4952A' }}>Sync Portfolio Images</strong> below.</li>
              <li>Refresh the portfolio page to see new images.</li>
            </Box>
          </CardContent>
        </Card>

        {/* Sync button */}
        <Box sx={{ marginBottom: '40px' }}>
          <Button
            onClick={handleSync}
            disabled={syncStatus === 'loading'}
            startIcon={
              <RefreshCw
                size={18}
                style={{ animation: syncStatus === 'loading' ? 'spin 1s linear infinite' : 'none' }}
              />
            }
            sx={{
              background: syncStatus === 'loading' ? 'rgba(212, 149, 42, 0.4)' : '#D4952A',
              color: '#1C1C1C',
              padding: '14px 36px',
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              borderRadius: 0,
              fontFamily: "'Barlow', sans-serif",
              transition: 'all 0.3s',
              '&:hover:not(:disabled)': {
                background: '#E8B050',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(212, 149, 42, 0.3)',
              },
            }}
          >
            {syncStatus === 'loading' ? 'Syncing...' : 'Sync Portfolio Images'}
          </Button>
        </Box>

        {/* Success result */}
        {syncStatus === 'success' && result && (
          <Card sx={{ background: 'rgba(212, 149, 42, 0.06)', border: '1px solid rgba(212, 149, 42, 0.35)', borderRadius: 0 }}>
            <CardContent sx={{ padding: '32px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <CheckCircle2 size={22} style={{ color: '#D4952A' }} />
                <Typography sx={{ color: '#F5EFE0', fontFamily: "'Libre Baskerville', serif", fontWeight: 700, fontSize: '1.1rem' }}>
                  Sync complete
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                {[
                  { icon: ImageIcon, label: 'Images found in Storage', value: result.found },
                  { icon: CheckCircle2, label: 'New images inserted', value: result.inserted },
                  { icon: SkipForward, label: 'Already existed (skipped)', value: result.skipped },
                ].map(({ icon: Icon, label, value }) => (
                  <Box key={label} sx={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '140px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon size={16} style={{ color: '#D4952A' }} />
                      <Typography sx={{ color: '#D4952A', fontSize: '2rem', fontFamily: "'Playfair Display', serif", fontWeight: 900, lineHeight: 1 }}>
                        {value}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#E8DFC8', fontSize: '0.8rem', fontFamily: "'Barlow', sans-serif", fontWeight: 300, letterSpacing: '0.05em' }}>
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
              {result.inserted > 0 ? (
                <Typography sx={{ color: '#E8DFC8', fontSize: '0.9rem', fontFamily: "'Barlow', sans-serif", marginTop: '20px', fontStyle: 'italic' }}>
                  {result.inserted} new image{result.inserted !== 1 ? 's' : ''} added — refresh the{' '}
                  <Box component="a" href="/#/portfolio" sx={{ color: '#D4952A', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    portfolio page
                  </Box>{' '}
                  to see them.
                </Typography>
              ) : (
                <Typography sx={{ color: '#6B6B6B', fontSize: '0.9rem', fontFamily: "'Barlow', sans-serif", marginTop: '20px', fontStyle: 'italic' }}>
                  No new images — everything in Storage is already in the portfolio.
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {syncStatus === 'error' && errorMsg && (
          <Card sx={{ background: 'rgba(180, 50, 50, 0.08)', border: '1px solid rgba(180, 50, 50, 0.3)', borderRadius: 0 }}>
            <CardContent sx={{ padding: '28px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <AlertCircle size={22} style={{ color: '#E05555', flexShrink: 0, marginTop: '2px' }} />
                <Box>
                  <Typography sx={{ color: '#F5EFE0', fontFamily: "'Libre Baskerville', serif", fontWeight: 700, fontSize: '1rem', marginBottom: '8px' }}>
                    Sync failed
                  </Typography>
                  <Typography sx={{ color: '#E8DFC8', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    {errorMsg}
                  </Typography>
                  <Typography sx={{ color: '#6B6B6B', fontSize: '0.85rem', fontFamily: "'Barlow', sans-serif", marginTop: '12px' }}>
                    Make sure the Edge Function is deployed and your account is in the admin_users table.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

      </Container>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </Box>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export function PortfolioAdmin() {
  const [authState, setAuthState] = useState<AuthState>('checking');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Check for an existing session on mount (survives page refresh)
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setAuthState(s ? 'authenticated' : 'unauthenticated');
    });

    // Keep state in sync if the session changes (e.g. token refresh, sign-out in another tab)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setAuthState(s ? 'authenticated' : 'unauthenticated');
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Loading — checking session ────────────────────────────────────────────
  if (authState === 'checking') {
    return (
      <Box sx={{ minHeight: '100vh', background: '#1C1C1C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#D4952A' }} />
      </Box>
    );
  }

  // ── Not logged in — show login form ───────────────────────────────────────
  if (authState === 'unauthenticated' || !session) {
    return <LoginForm onSuccess={() => setAuthState('checking')} />;
  }

  // ── Authenticated admin ───────────────────────────────────────────────────
  return (
    <AdminPanel
      session={session}
      onLogout={() => {
        setSession(null);
        setAuthState('unauthenticated');
      }}
    />
  );
}
