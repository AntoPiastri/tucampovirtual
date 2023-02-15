import { Alert, Button, Grid, TextField, Typography } from "@mui/material"
import { useForm } from "../../hooks"
import { useDispatch, useSelector } from "react-redux"
import { agregarEstablecimiento, cleanMessagge } from "../../store/auth/thunks"
import { selectErrorMessage, selectSuccessMessage, selectUser } from "../../store/auth"
import { useEffect } from "react"
import { GestorLayout } from "../layout/GestorLayout"
import { useState } from "react"

export const AgregarEstablecimientoPage = () => {



    const errorMessage = useSelector(selectErrorMessage)
    const successMessage = useSelector(selectSuccessMessage)
    useEffect(() => { if (errorMessage || successMessage) { setTimeout(function () { dispatch(cleanMessagge()); }, 5000); } }, [errorMessage])


    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const { nombreEstablecimiento, nombreProductor, dicoseFisico,  cantidadDicosePropiedad, onInputChange } = useForm({
        nombreEstablecimiento: "",
        nombreProductor: "",
        dicoseFisico: "",
        cantidadDicosePropiedad: ""
    })
    const [valoresDicosePropiedad, setValoresDicosePropiedad] = useState([])

    const [camposDicose, setCamposDicose] = useState([]);
    const addCampo = () => {
        if (cantidadDicosePropiedad == 1 || cantidadDicosePropiedad == 2 || cantidadDicosePropiedad == 3) {
            let aux = [];
            for (let i = 1; i <= parseInt(cantidadDicosePropiedad); i++) {
                aux.push(i)

            }
            setCamposDicose(aux)
        }
        else {
            setCamposDicose([])
        }

    }
    useEffect(() => { const funcionTest = async () => { addCampo() }; funcionTest() }, [cantidadDicosePropiedad])


    const onSubmit = (event) => {
        event.preventDefault();
        dispatch(agregarEstablecimiento(user.email, user.token, nombreEstablecimiento, nombreProductor, dicoseFisico, rubroPrincipal, cantidadDicosePropiedad, valoresDicosePropiedad))

    }

    const [rubroPrincipal,setRubroPrincipal]=useState("")
    const handleRubroPrincipal = (event) => {
        setRubroPrincipal(event.target.value)
    }
    const handleDicoses = (event) => {
        const name = event.target.name
        const aux = valoresDicosePropiedad
        if (name == "Dicose 1") {
            if (aux == 0) {
                aux.push(event.target.value)

            }
            else {
                aux[0] = event.target.value
            }
            setValoresDicosePropiedad(aux)
        }
        else if (name == "Dicose 2") {
            if (aux == 1) {
                aux.push(event.target.value)

            }
            else {
                aux[1] = event.target.value
            }
            setValoresDicosePropiedad(aux)

        }
        else if (name == "Dicose 3") {
            if (aux == 2) {
                aux.push(event.target.value)

            }
            else {
                aux[2] = event.target.value
            }
            setValoresDicosePropiedad(aux)

        }
    }


  

    return (
        <GestorLayout>
            <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: "100vh", backgroundImage: `url("http://demos.alan.sh/files/images/nk4RN.png")`, backgroundSize: "cover", backgroundPosition: "10% 52%", padding: 4 }}>
                <Grid item className="box-shadow"
                    xs={3}
                    sx={{ width: { sm: 450 }, backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: 3, borderRadius: 2 }}>
                    <Typography variant="h5">Ingresa tu establecimiento</Typography>

                    <form onSubmit={onSubmit}>
                        <Grid container>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Nombre de establecimiento"
                                    type="text"
                                    placeholder="Establecimiento La Campana"
                                    fullWidth
                                    name="nombreEstablecimiento"
                                    value={nombreEstablecimiento}
                                    onChange={onInputChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Nombre de productor"
                                    type="text"
                                    placeholder="Patricio Silva"
                                    fullWidth
                                    name="nombreProductor"
                                    value={nombreProductor}
                                    onChange={onInputChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Dicose físico"
                                    type="text"
                                    placeholder="123456"
                                    fullWidth
                                    name="dicoseFisico"
                                    value={dicoseFisico}
                                    onChange={onInputChange}
                                />
                            </Grid>
                        </Grid>
                        
                        <Grid container>
                            <Grid item xs={12} sx={{ '& .MuiTextField-root': { mt: 2, width: '44.5ch' },}}>
                                <TextField
                                    select
                                    label="Rubro principal"
                                    SelectProps={{
                                        native: true,
                                    }}
                                    
                                    onChange={handleRubroPrincipal}
                                >
                                    <option key={1} value={"Cria"}>
                                        {"Cría"}
                                    </option>
                                    <option key={2} value={"Recria"}>
                                        {"Recría"}
                                    </option>
                                    <option key={3} value={"Cria y recria"}>
                                        {"Cría y recría"}
                                    </option>
                                    <option key={4} value={"Invernada"}>
                                        {"Invernada"}
                                    </option>
                                    <option key={5} value={"Ciclo completo"}>
                                        {"Ciclo completo"}
                                    </option>
                                    <option key={6} value={"Feedlot"}>
                                        {"Feedlot"}
                                    </option>
                                </TextField>
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Cantidad de dicoses en propiedad"
                                    type="text"
                                    placeholder="1"
                                    fullWidth
                                    name="cantidadDicosePropiedad"
                                    value={cantidadDicosePropiedad}
                                    onChange={onInputChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid>
                            {camposDicose.map(campo =>
                            (<Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label={"Dicose " + campo}
                                    type="text"
                                    placeholder={"Dicose " + campo}
                                    fullWidth
                                    name={"Dicose " + campo}
                                    onChange={handleDicoses}
                                />
                            </Grid>
                            ))}
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sx={{ mt: 2 }} display={!!successMessage ? "" : "none"}>
                                <Alert severity="success">{successMessage}</Alert>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sx={{ mt: 2 }} display={!!errorMessage ? "" : "none"}>
                                <Alert severity="error">{errorMessage}</Alert>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
                            <Grid item xs={12} sm={12}>
                                <Button type="submit" variant="contained" fullWidth>
                                    Ingresar
                                </Button>
                            </Grid>

                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </GestorLayout>


    )
}