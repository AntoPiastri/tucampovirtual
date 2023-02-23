import { FileUploadOutlined } from "@mui/icons-material"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Typography } from "@mui/material"
import { DataGrid, esES, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid"
import { useState } from "react"
import { useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectErrorMessage, selectEstablecimiento, selectLoadComponent, selectSuccessMessage, selectUser } from "../../store/auth"
import { obtenerAnimales, sendFiletoBack } from "../../store/auth/thunks"
import { GestorLayout } from "../layout/GestorLayout"
import * as XLSX from "xlsx"



export const AnimalesPage = () => {
  {

    const [avise, setAvise] = useState({ "titulo": "Subiendo archivo", "contenido": "Espera mientras procesamos tus animales", "activeButton": true });
    const errorMessage = useSelector(selectErrorMessage)
    const successMessage = useSelector(selectSuccessMessage)
    useEffect(() => { if (errorMessage || successMessage) { setAvise(successMessage) } }, [successMessage])
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
      setAvise({ "titulo": "Subiendo archivo", "contenido": "Espera mientras procesamos tus animales", "activeButton": true })
    };


    const user = useSelector(selectUser);
    const dispatch = useDispatch();


    const establecimiento = useSelector(selectEstablecimiento)
    const dicoseFisco = establecimiento.dicoseFisico;
    let [animales, cargarAnimales] = useState([])

    useEffect(() => { const funcionTest = async () => { cargarAnimales(await obtenerAnimales(user.email, user.token, dicoseFisco)) }; funcionTest() }, [])


    const filtrarAnimales = () => {
      let animalesAux = [];
      animales?.map(animal => (animalesAux.push({
        id: animal.numeroCaravana,
        raza: animal.raza,
        cruza: animal.cruza,
        sexo: animal.sexo,
        edadMeses: animal.edadMeses,
        dicosePropietario: animal.dicosePropietario,
        dicoseUbicacion: animal.dicoseUbicacion,
        dicoseTenedor: animal.dicoseTenedor,
        statusVida: animal.statusVida,
        statusTrazabilidad: animal.statusTrazabilidad,
        pesoActual: animal.pesoActual,
        disponibleVenta: animal.disponibleVenta
      })))
      return animalesAux
    }
    animales = filtrarAnimales();

    const fileInputRef = useRef();
    const onFileInputChange = ({ target }) => {
      if (target.files === 0) return;
      console.log(target.files[0])
      dispatch(sendFiletoBack(user.email, user.token, target.files[0]))
      handleClickOpen()
    };

    const columns = [
      { field: 'id', headerName: 'Caravana', width: 100 },
      { field: 'raza', headerName: 'Raza', width: 50 },
      { field: 'cruza', headerName: 'Cruza', width: 60 },
      { field: 'sexo', headerName: 'Sexo', width: 80 },
      { field: 'edadMeses', headerName: 'Edad (Meses)', type: 'number', width: 125, },
      { field: 'dicosePropietario', headerName: 'Propietario', width: 120 },
      { field: 'dicoseUbicacion', headerName: 'Ubicación', width: 120 },
      { field: 'dicoseTenedor', headerName: 'Tenedor', width: 120 },
      { field: 'statusVida', headerName: 'Status', width: 80 },
      { field: 'statusTrazabilidad', headerName: 'Trazabilidad', width: 110 },
      { field: 'pesoActual', headerName: 'Peso (Kg)', width: 90 },
      { field: 'disponibleVenta', headerName: 'Disponible para venta', width: 180 },
    ];

    const rows = [
      {
        id: 28932485,
        raza: "HE",
        cruza: "AA",
        sexo: "Hembra",
        edadMeses: "128",
        dicosePropietario: "150722098",
        dicoseUbicacion: "10916399",
        dicoseTenedor: "150722098",
        statusVida: "Vivo",
        statusTrazabilidad: "Trazado",
        pesoActual: "0",
        disponibleVenta: false
      }
    ]


    function CustomToolbar() {
      return (
        <GridToolbarContainer  >
          <GridToolbarFilterButton />
          <GridToolbarExport />
          <input type={"file"} onChange={onFileInputChange} style={{ display: "none" }} ref={fileInputRef}></input>
          <IconButton size="large" onClick={() => fileInputRef.current.click()}>
            <FileUploadOutlined color="primary" ></FileUploadOutlined>
            <Typography color="primary" variant="button" display="block">CARGAR</Typography>
          </IconButton>
        </GridToolbarContainer>

      );
    }



    const loadComponent = useSelector(selectLoadComponent)

    return (
      <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: "100vh", backgroundImage: `url("http://demos.alan.sh/files/images/ujkoW.jpg")`, backgroundSize: "cover", backgroundPosition: "10% 52%", padding: 4 }}>
        <GestorLayout></GestorLayout>
        <div style={{ width: '100%' }}>
          <DataGrid
            rows={animales}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5]}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            components={{ Toolbar: CustomToolbar }}
            autoHeight
            sx={{
              marginTop: "5%",
              p: 4,
              fontSize: 16,
              color: "white",
              font: 'center',
              borderColor: 'rgba(0, 0, 0, 0)',
              backgroundColor: "rgba(0, 0, 0, 0.1)"
            }}

          />
        </div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{avise.titulo}</DialogTitle>
          <DialogContent>
            <DialogContentText id="1">
              {avise.contenido}
            </DialogContentText>
            <DialogContentText id="2">
              {avise?.create}
            </DialogContentText>
            <DialogContentText id="3">
              {avise?.update}
            </DialogContentText>
            <DialogContentText id="4">
              {avise?.error}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={avise.activeButton}>Aceptar</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    )
  }
}
