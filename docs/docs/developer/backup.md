# Backup

See `create-backup.sh` for the technicalities of the backup system. The gist is: we copy and compress the current volume mount for the database container.

## Cron Job
We run a cron job once every month. More details about this, consult the [VPS Documentation](https://docs.systemhealthlab.com/Tools/cron/) of the UWA System Health Lab.