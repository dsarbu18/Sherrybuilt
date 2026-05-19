import { Container, Box, Typography, Button } from '@mui/material';
import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Typography variant="h1" className="font-bold mb-4 text-gray-900" sx={{ fontSize: { xs: '6rem', md: '10rem' } }}>
            404
          </Typography>
          <Typography variant="h3" className="font-bold mb-4 text-gray-900">
            Page Not Found
          </Typography>
          <Typography variant="h6" color="text.secondary" className="mb-8 max-w-lg mx-auto">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </Typography>
          <Box className="flex gap-4 justify-center flex-wrap">
            <Button
              component={Link}
              to="/"
              variant="contained"
              size="large"
              startIcon={<Home />}
              sx={{ px: 4, py: 1.5 }}
            >
              Go Home
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="outlined"
              size="large"
              startIcon={<ArrowLeft />}
              sx={{ px: 4, py: 1.5 }}
            >
              Go Back
            </Button>
          </Box>
        </motion.div>
      </Container>
    </div>
  );
}
