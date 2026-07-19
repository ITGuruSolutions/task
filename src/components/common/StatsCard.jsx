import { Box, Card, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, title, value, trend, color, delay = 0 }) => {
  const theme = useTheme();

  const colorMap = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
  };

  const bgColorMap = {
    primary: 'rgba(37, 99, 235, 0.1)',
    secondary: 'rgba(20, 184, 166, 0.1)',
    success: 'rgba(34, 197, 94, 0.1)',
    warning: 'rgba(245, 158, 11, 0.1)',
  };

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      sx={{
        p: 3,
        height: 140,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            backgroundColor: bgColorMap[color] || bgColorMap.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={28} color={colorMap[color] || colorMap.primary} />
        </Box>
        {trend && (
          <Box
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: 1,
              backgroundColor: trend.includes('+')
                ? 'rgba(34, 197, 94, 0.1)'
                : 'rgba(239, 68, 68, 0.1)',
              color: trend.includes('+')
                ? theme.palette.success.main
                : theme.palette.error.main,
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            {trend}
          </Box>
        )}
      </Box>
      <Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            fontSize: '2rem',
            color: 'text.primary',
            mb: 0.5,
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>
      </Box>
    </Card>
  );
};

export default StatsCard;
