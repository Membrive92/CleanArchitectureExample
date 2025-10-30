export type HealthStatus = {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
};

export const checkHealth = (): HealthStatus => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString()
  };
};
