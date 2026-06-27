import { useState } from 'react';
import {
  Container, Box, Typography, TextField, Button, Paper,
  Grid, Select, MenuItem, FormControl, InputLabel, Alert,
  CircularProgress,
} from '@mui/material';
import { motion } from 'motion/react';
import { Send, CheckCircle2, ArrowRight, FileText, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../utils/supabase/client';
import { sendQuoteEmail } from '../../../utils/web3forms';

// ─── Shared field style ───────────────────────────────────────────────────────

const FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    color: '#F5EFE0',
    fontFamily: '"Barlow", sans-serif',
    '& fieldset': { borderColor: 'rgba(212, 149, 42, 0.3)' },
    '&:hover fieldset': { borderColor: 'rgba(212, 149, 42, 0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#D4952A' },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(245, 239, 224, 0.7)',
    fontFamily: '"Barlow", sans-serif',
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#D4952A' },
};

const SELECT_SX = {
  ...FIELD_SX,
  '& .MuiSvgIcon-root': { color: 'rgba(212, 149, 42, 0.7)' },
};

const MENU_PROPS = {
  PaperProps: {
    sx: {
      backgroundColor: '#2A2A2A',
      border: '1px solid rgba(212, 149, 42, 0.3)',
      '& .MuiMenuItem-root': {
        color: '#F5EFE0',
        fontFamily: '"Barlow", sans-serif',
        '&:hover': { backgroundColor: 'rgba(212, 149, 42, 0.15)' },
        '&.Mui-selected': {
          backgroundColor: 'rgba(212, 149, 42, 0.25)',
          '&:hover': { backgroundColor: 'rgba(212, 149, 42, 0.35)' },
        },
      },
    },
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  projectLocation: string;
  serviceNeeded: string;
  preferredContactMethod: string;
  message: string;
}

const EMPTY_FORM: FormData = {
  fullName: '',
  email: '',
  phone: '',
  projectLocation: '',
  serviceNeeded: '',
  preferredContactMethod: '',
  message: '',
};

const SERVICES = [
  'Kitchen Remodeling',
  'Bathroom Renovation',
  'Basement Finishing',
  'Full Home Remodel',
  'Other',
];

const CONTACT_METHODS = ['Email', 'Phone', 'Text Message', 'Any'];

// ─── Component ────────────────────────────────────────────────────────────────

export function QuoteRequest() {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  // true when quote was saved to Supabase but the Web3Forms email failed
  const [emailWarning, setEmailWarning] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setEmailWarning(false);
    setSubmitError(null);

    // ── Step 1: Save to Supabase ─────────────────────────────────────────────
    // This is the source of truth. If it fails, we stop and show an error.
    const { error: dbError } = await supabase.from('quote_requests').insert({
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone || null,
      project_location: formData.projectLocation || null,
      service_needed: formData.serviceNeeded || null,
      preferred_contact_method: formData.preferredContactMethod || null,
      message: formData.message,
    });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      setSubmitError('Unable to submit your request right now. Please try again or call us directly.');
      setIsSubmitting(false);
      return;
    }

    // ── Step 2: Send email via Web3Forms ─────────────────────────────────────
    // Non-blocking — the lead is already saved. If email fails, we warn the
    // user but still show success so they know their request was received.
    try {
      await sendQuoteEmail({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        projectLocation: formData.projectLocation,
        serviceNeeded: formData.serviceNeeded,
        preferredContactMethod: formData.preferredContactMethod,
        message: formData.message,
      });
    } catch (emailErr) {
      console.warn('Web3Forms email failed (quote still saved):', emailErr);
      setEmailWarning(true);
    }

    setSubmitSuccess(true);
    setFormData(EMPTY_FORM);
    setIsSubmitting(false);

    setTimeout(() => {
      document.getElementById('success-message')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1C1C1C' }}>

      {/* Hero */}
      <section className="py-16" style={{
        background: 'linear-gradient(135deg, rgba(28, 28, 28, 0.98) 0%, rgba(40, 40, 40, 0.95) 100%)',
        borderBottom: '1px solid rgba(212, 149, 42, 0.2)',
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Box className="flex justify-center mb-4">
              <FileText size={56} style={{ color: '#D4952A' }} />
            </Box>
            <Typography
              variant="h2"
              className="font-bold mb-4"
              sx={{ fontFamily: '"Playfair Display", serif', color: '#F5EFE0', fontSize: { xs: '2.5rem', md: '3.5rem' } }}
            >
              Request a Free Quote
            </Typography>
            <Typography
              variant="h6"
              className="font-light max-w-2xl mx-auto"
              sx={{ fontFamily: '"Libre Baskerville", serif', fontStyle: 'italic', color: 'rgba(245, 239, 224, 0.85)', fontSize: { xs: '1.1rem', md: '1.3rem' } }}
            >
            </Typography>
          </motion.div>
        </Container>
      </section>

      {/* Form */}
      <section className="py-16">
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>

            {/* ── Success ──────────────────────────────────────────────────── */}
            {submitSuccess && (
              <Box id="success-message" sx={{ marginBottom: '32px' }}>
                <Alert
                  severity="success"
                  icon={<CheckCircle2 />}
                  sx={{
                    fontSize: '1.1rem',
                    py: 2,
                    backgroundColor: 'rgba(212, 149, 42, 0.15)',
                    border: '1px solid rgba(212, 149, 42, 0.4)',
                    color: '#D4952A',
                    '& .MuiAlert-message': { width: '100%' },
                    '& .MuiAlert-icon': { color: '#D4952A' },
                  }}
                >
                  <Typography variant="h6" className="font-bold mb-2" sx={{ fontFamily: '"Libre Baskerville", serif', color: '#D4952A' }}>
                    Thank you! Your quote request has been received.
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: '"Barlow", sans-serif', color: '#F5EFE0' }}>
                    We'll get back to you within 24 hours via your preferred contact method.
                  </Typography>
                </Alert>

                {/* ── Email warning (soft fail) ─────────────────────────── */}
                {emailWarning && (
                  <Alert
                    severity="warning"
                    icon={<AlertTriangle size={20} />}
                    sx={{
                      marginTop: '12px',
                      backgroundColor: 'rgba(180, 120, 20, 0.12)',
                      border: '1px solid rgba(180, 120, 20, 0.35)',
                      color: '#E8B050',
                      '& .MuiAlert-icon': { color: '#E8B050' },
                    }}
                  >
                    <Typography variant="body2" sx={{ fontFamily: '"Barlow", sans-serif', color: '#E8DFC8' }}>
                      Your request was saved successfully, but the email notification may be delayed.
                      We still have your information and will be in touch soon.
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}

            {/* ── Hard error ───────────────────────────────────────────────── */}
            {submitError && (
              <Alert
                severity="error"
                sx={{
                  marginBottom: '32px',
                  backgroundColor: 'rgba(180, 50, 50, 0.12)',
                  border: '1px solid rgba(180, 50, 50, 0.35)',
                  color: '#E05555',
                  '& .MuiAlert-icon': { color: '#E05555' },
                }}
              >
                <Typography variant="body2" sx={{ fontFamily: '"Barlow", sans-serif' }}>
                  {submitError}
                </Typography>
              </Alert>
            )}

            <Paper
              elevation={4}
              className="p-10"
              sx={{
                backgroundColor: 'rgba(245, 239, 224, 0.05)',
                border: '1px solid rgba(212, 149, 42, 0.2)',
                borderRadius: '8px',
              }}
            >
              <Typography
                variant="h5"
                className="font-bold mb-2"
                sx={{ fontFamily: '"Playfair Display", serif', color: '#D4952A', fontSize: { xs: '1.5rem', md: '1.75rem' } }}
              >
                Project Information
              </Typography>
              <Typography
                variant="body2"
                className="mb-8"
                sx={{ fontFamily: '"Barlow", sans-serif', color: 'rgba(245, 239, 224, 0.7)', fontSize: '0.95rem' }}
              >
                Please fill out the form below with as much detail as possible. Fields marked with * are required.
              </Typography>

              <form onSubmit={handleSubmit}>
                {/* Honeypot — hidden from real users; bots tend to fill this in */}
                <input
                  type="checkbox"
                  name="botcheck"
                  defaultChecked={false}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  aria-hidden="true"
                />

                <Grid container spacing={3}>

                  {/* Full Name */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth label="Full Name *" name="fullName"
                      value={formData.fullName} onChange={handleChange}
                      required variant="outlined" placeholder="John Doe"
                      sx={FIELD_SX}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth label="Email Address *" name="email"
                      type="email" value={formData.email} onChange={handleChange}
                      required variant="outlined" placeholder="john@example.com"
                      sx={FIELD_SX}
                    />
                  </Grid>

                  {/* Phone */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth label="Phone Number" name="phone"
                      value={formData.phone} onChange={handleChange}
                      variant="outlined" placeholder="(555) 123-4567"
                      sx={FIELD_SX}
                    />
                  </Grid>

                  {/* Project Location */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth label="Project Location" name="projectLocation"
                      value={formData.projectLocation} onChange={handleChange}
                      variant="outlined" placeholder="City, Province or Postal Code"
                      sx={FIELD_SX}
                    />
                  </Grid>

                  {/* Service Needed */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth variant="outlined" sx={SELECT_SX}>
                      <InputLabel>Service Needed</InputLabel>
                      <Select
                        name="serviceNeeded" value={formData.serviceNeeded}
                        onChange={handleChange} label="Service Needed"
                        MenuProps={MENU_PROPS}
                      >
                        <MenuItem value=""><em>Select a service</em></MenuItem>
                        {SERVICES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Preferred Contact Method */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth variant="outlined" sx={SELECT_SX}>
                      <InputLabel>Preferred Contact Method</InputLabel>
                      <Select
                        name="preferredContactMethod" value={formData.preferredContactMethod}
                        onChange={handleChange} label="Preferred Contact Method"
                        MenuProps={MENU_PROPS}
                      >
                        <MenuItem value=""><em>Select a method</em></MenuItem>
                        {CONTACT_METHODS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Message */}
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth label="Project Description / Message *" name="message"
                      value={formData.message} onChange={handleChange}
                      required multiline rows={6} variant="outlined"
                      placeholder="Please describe your project in detail. Include timeline, budget range, specific requirements, and anything else that will help us provide an accurate quote."
                      sx={FIELD_SX}
                    />
                  </Grid>

                  {/* Submit */}
                  <Grid size={{ xs: 12 }}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={isSubmitting}
                        endIcon={isSubmitting
                          ? <CircularProgress size={18} sx={{ color: '#1C1C1C' }} />
                          : <ArrowRight />
                        }
                        sx={{
                          py: 2,
                          fontSize: '1.2rem',
                          fontWeight: 700,
                          fontFamily: '"Libre Baskerville", serif',
                          textTransform: 'none',
                          background: 'linear-gradient(135deg, #D4952A 0%, #A87020 100%)',
                          color: '#1C1C1C',
                          boxShadow: '0 8px 16px rgba(212, 149, 42, 0.4)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #E8B050 0%, #D4952A 100%)',
                            boxShadow: '0 12px 24px rgba(212, 149, 42, 0.5)',
                          },
                          '&:disabled': {
                            background: 'rgba(212, 149, 42, 0.5)',
                            color: 'rgba(28, 28, 28, 0.5)',
                          },
                        }}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                      </Button>
                    </motion.div>

                    <Typography
                      variant="caption"
                      className="text-center block mt-3"
                      sx={{ fontFamily: '"Barlow", sans-serif', color: 'rgba(245, 239, 224, 0.5)', fontSize: '0.85rem' }}
                    >
                      We respect your privacy. Your information is never shared with third parties.
                    </Typography>
                  </Grid>

                </Grid>
              </form>
            </Paper>

            {/* Benefits */}
            <Box className="mt-12">
              <Grid container spacing={4}>
                {[
                  { title: 'Fast Response', description: '24-hour turnaround on all quote requests' },
                  { title: 'Detailed Estimates', description: 'Transparent pricing with no hidden fees' },
                  { title: 'Free Consultation', description: 'Expert advice at no charge' },
                ].map((benefit, idx) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={idx}>
                    <Box
                      className="text-center p-6 rounded-lg"
                      sx={{
                        backgroundColor: 'rgba(245, 239, 224, 0.05)',
                        border: '1px solid rgba(212, 149, 42, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': { borderColor: 'rgba(212, 149, 42, 0.4)', backgroundColor: 'rgba(245, 239, 224, 0.08)' },
                      }}
                    >
                      <Box className="flex justify-center mb-3">
                        <Box
                          className="p-3 rounded-full"
                          sx={{ backgroundColor: 'rgba(212, 149, 42, 0.15)', border: '1px solid rgba(212, 149, 42, 0.3)' }}
                        >
                          <CheckCircle2 style={{ color: '#D4952A' }} size={32} />
                        </Box>
                      </Box>
                      <Typography
                        variant="h6" className="font-bold mb-2"
                        sx={{ fontFamily: '"Libre Baskerville", serif', color: '#D4952A', fontSize: '1.25rem' }}
                      >
                        {benefit.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: '"Barlow", sans-serif', color: 'rgba(245, 239, 224, 0.8)', fontSize: '0.95rem' }}
                      >
                        {benefit.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

          </motion.div>
        </Container>
      </section>
    </div>
  );
}
