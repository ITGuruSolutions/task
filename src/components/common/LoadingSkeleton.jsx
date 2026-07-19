import { Box, Skeleton, Card, Grid } from '@mui/material';

const LoadingSkeleton = () => {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Stats Cards Skeleton */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
            <Card sx={{ p: 3, height: 120 }}>
              <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="40%" height={32} />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Action Bar Skeleton */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Skeleton variant="rectangular" width={250} height={40} />
          <Skeleton variant="rectangular" width={120} height={40} />
          <Skeleton variant="rectangular" width={120} height={40} />
          <Skeleton variant="rectangular" width={120} height={40} sx={{ ml: 'auto' }} />
        </Box>
      </Card>

      {/* Table Skeleton */}
      <Card sx={{ p: 2 }}>
        <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton
            key={item}
            variant="rectangular"
            width="100%"
            height={56}
            sx={{ mb: 1 }}
          />
        ))}
        <Skeleton variant="rectangular" width="100%" height={56} sx={{ mt: 2 }} />
      </Card>
    </Box>
  );
};

export default LoadingSkeleton;
