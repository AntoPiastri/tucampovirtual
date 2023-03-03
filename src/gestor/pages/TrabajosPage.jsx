import { Alert, Button, Grid} from "@mui/material"
import { DataGrid, esES} from "@mui/x-data-grid"
import { useState } from "react"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectEcografias, selectErrorMessage,selectIdSesion,selectPesadas, selectSanitarios, selectSuccessMessage, selectUser } from "../../store/auth"
import { cleanMessagge, getTrabajos} from "../../store/auth/thunks"
import { GestorLayout } from "../layout/GestorLayout"



export const TrabajosPages = () => {
  {
    const errorMessage = useSelector(selectErrorMessage)
    const successMessage = useSelector(selectSuccessMessage)
    const user = useSelector(selectUser);
    const dispatch = useDispatch();


    let [trabajos, setTrabajos] = useState([])

    const pesadas = useSelector(selectPesadas);
    const ecografias = useSelector(selectEcografias);
    const sanitarios = useSelector(selectSanitarios);

    useEffect(() => { if (pesadas != null) { setTrabajos(filtrarTrabajos("Pesadas")) } }, [pesadas])
    useEffect(() => { if (ecografias != null) { setTrabajos(filtrarTrabajos("Ecografias")) } }, [ecografias])
    useEffect(() => { if (sanitarios != null) { setTrabajos(filtrarTrabajos("Sanitarios")) } }, [sanitarios])

    const filtroEsUltimoTrabajoCaravana = (estado) => {
      if (estado == true) {
        return "Sí"
      }
      else {
        return "No"
      }
    }
    const setDescription = (type, trabajo) => {
      if (type == "Pesadas") {
        return "El peso del animal fue de  " + trabajo.pesoAnimal+" kilos";
      }
      else if (type == "Ecografias") {
        return "El encargado  " + trabajo.encargadoTrabajo + " con resultado " + trabajo.estadoAnimal;
      }
      else if (type == "Sanitarios") {
        return trabajo.tipoAplicacion + " con  " + trabajo.principioActivo+", esperar "+trabajo.tiempoEsperaDias+ " días.";
      }

    }
    const filtrarTrabajos = (type) => {
      let trabajosAux = [];
      if (type == "Pesadas") {
        pesadas?.map(pesada => (trabajosAux.push({
          id: pesada.numeroCaravana,
          fecha: pesada.fechaTrabajo,
          esUltimoTrabajoCaravana: filtroEsUltimoTrabajoCaravana(pesada.esUltimoTrabajoCaravana),
          descripcion: setDescription(type, pesada),
        })))
      }
      else if (type == "Ecografias") {
        ecografias?.map(ecografia => (trabajosAux.push({
          id: ecografia.numeroCaravana,
          fecha: ecografia.fechaTrabajo,
          esUltimoTrabajoCaravana: filtroEsUltimoTrabajoCaravana(ecografia.esUltimoTrabajoCaravana),
          descripcion: setDescription(type, ecografia),
        })))
      }
      else if (type == "Sanitarios") {
        sanitarios?.map(sanitario => (trabajosAux.push({
          id: sanitario.numeroCaravana,
          fecha: sanitario.fechaTrabajo,
          esUltimoTrabajoCaravana: filtroEsUltimoTrabajoCaravana(sanitario.esUltimoTrabajoCaravana),
          descripcion: setDescription(type, sanitario),
        })))
      }
      return trabajosAux
    }




    const columns = [
      { field: 'id', headerName: 'Caravana', width: 100 },
      { field: 'fecha', headerName: 'Fecha', width: 115 },
      { field: 'esUltimoTrabajoCaravana', headerName: '¿Último trabajo del animal?', width: 260 },
      { field: 'descripcion', headerName: 'Descripción', width: 500 }
    ];

    const id =useSelector(selectIdSesion);
    const showTrabajo = (trabajo) => {
      dispatch(getTrabajos(id,trabajo, user.email, user.token))
    }


    useEffect(() => { if (errorMessage || successMessage) { setTimeout(function () { dispatch(cleanMessagge()); }, 5000); } }, [errorMessage, successMessage])



    return (
      <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: "100vh", backgroundImage: `url("http://demos.alan.sh/files/images/ujkoW.jpg")`, backgroundSize: "cover", backgroundPosition: "10% 52%", padding: 4 }}>
        <GestorLayout></GestorLayout>
        <Grid container spacing={4} direction="row" alignItems="center" justifyContent="center">
          <Grid item >
            <Button variant="contained" color="primary" onClick={() => { showTrabajo("Pesadas") }}>Pesadas</Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => { showTrabajo("Ecografias") }}>Ecografías</Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => { showTrabajo("Sanitarios") }}>Sanitarios</Button>
          </Grid>
        </Grid>
        <div style={{ width: '100%' }}>
          <Grid container>
            <Grid item xs={12} sx={{ mt: 2 }} display={!!errorMessage ? "" : "none"}>
              <Alert severity="error">{errorMessage}</Alert>
            </Grid>
          </Grid>
          <DataGrid
            rows={trabajos}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5]}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            autoHeight
            sx={{ marginTop: "3%", p: 4, fontSize: 16, color: "black", font: 'center', borderColor: 'rgba(0, 0, 0, 0)', backgroundColor: "rgba(255, 255, 255, 0.3)" }} />
        </div>
      </Grid>
    )
  }
}
