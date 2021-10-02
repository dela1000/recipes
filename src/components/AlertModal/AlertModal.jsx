import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Box, Grid, Modal, Fade, Typography } from '@material-ui/core';
import { useRecoilValue } from 'recoil';
import { alertModalState } from '../../contexts/atoms/atoms';

const style = {
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 220,
  bgcolor: 'background.paper',
};

export default function AlertModal({ handleFunction }) {
  const alertModalOn = useRecoilValue(alertModalState);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOnClick = () => {
    handleFunction();
    handleClose();
  };

  useEffect(() => {
    if (alertModalOn) {
      handleOpen();
    }
  }, [alertModalOn]);

  return (
    <div>
      <div className="flex h-full w-full -pt-12 z-50">
        <div className="m-auto">
          <div>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={open}
              onClose={handleClose}
              closeAfterTransition
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={open}>
                <Box className="absolute p-10" sx={style}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      <div className="text-2xl monserrat">DELETE RECIPE</div>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Typography>Are you sure you want to delete this recipe?</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Box justify="flex-end" textAlign="right">
                        <button
                          type="button"
                          onClick={handleOnClick}
                          className="uppercase px-4 py-2 text-xs bg-gray-600 text-blue-100 hover:bg-gray-600 duration-300 w-32 mx-1 h-14"
                        >
                          Delete Recipe
                        </button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

AlertModal.propTypes = {
  handleFunction: PropTypes.func.isRequired,
};
