import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

// Lo exportamos como una constante
export const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: 'var(--accent)',
        // Usamos el acceso seguro a theme.palette o theme.applyStyles
        ...(theme.palette.mode === 'dark' && {
          backgroundColor: 'var(--accent-dark)',
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: 'var(--gray-300)',
    boxSizing: 'border-box',
    ...(theme.palette.mode === 'dark' && {
      backgroundColor: 'var(--gray-200)',
    }),
  },
}));