import { useState, useEffect, useRef } from 'react'
import { ScrollView, Button, View, Platform } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { addRegistro, updateRegistro } from '../store/actions/info'
import { setLoading } from '../store/reducers/info';

// 3rd party components
import { Formik } from 'formik'
import * as Yup from 'yup'

// Components
import { MyTextArea, MyTextInput, MyText, MySelect, MyRadioButtonGroup, MyList, MyDatePicker } from '../components/Formulario'

// Helpers
import { getPDF } from '../helpers/fetch';

// Styles
import { styles } from '../styles';

const RegistroFormulario = ({ navigation, route }) => {
    const { id_tag, tarea } = route.params
    const initialValues = {};
    const requiredFields = {};
    const requiredFieldsArray = {};

    let planilla
    let planilla_id

    // Ref
    const submitType = useRef()
    const goBack = useRef(false)

    // State
    const [formDisabled, setFormDisabled] = useState(false)

    // Redux
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    const registro = useSelector(state => state.info.registros.find(reg => reg.elemento === id_tag && reg.tarea === tarea.id))
    const { loading } = useSelector(state => state.info)
    if (registro === undefined) {
        planilla = tarea.planilla.formulario
        planilla_id = tarea.planilla._id
    } else {
        planilla = registro.formulario
    }

    for (const input of planilla) {
        if (input.type === 'list') {
            let valoresArray = {}
            for (const arrayItem of input.items) {
                // console.log(arrayItem)
                valoresArray = {
                    ...valoresArray,
                    [arrayItem.name]: arrayItem.value
                };

                if (!arrayItem.validations) continue;

                let schemaArrayItem = Yup.string()

                for (const ruleArrayItem of arrayItem.validations) {
                    if (ruleArrayItem.type === 'required') {
                        schemaArrayItem = schemaArrayItem.required('Este campo es requerido');
                    }

                    if (ruleArrayItem.type === 'minLength') {
                        schemaArrayItem = schemaArrayItem.min(ruleArrayItem.value || 2, `Mínimo de ${ruleArrayItem.value || 2} caracteres`);
                    }

                    if (ruleArrayItem.type === 'email') {
                        schemaArrayItem = schemaArrayItem.email(`Revise el formato del email`);
                    }
                    // ... otras reglas
                }
                requiredFieldsArray[arrayItem.name] = schemaArrayItem;
            }
            initialValues[input.name] = [valoresArray];
            requiredFields[input.name] = Yup.array(Yup.object({ ...requiredFieldsArray }));
        } else {
            initialValues[input.name] = input.value;
        }

        if (!input.validations) continue;

        let schema = Yup.string()

        for (const rule of input.validations) {
            if (rule.type === 'required') {
                schema = schema.required('Este campo es requerido');
            }
            if (rule.type === 'minLength') {
                schema = schema.min(rule.value || 2, `Mínimo de ${rule.value || 2} caracteres`);
            }
            if (rule.type === 'email') {
                schema = schema.email(`Revise el formato del email`);
            }

            // ... otras reglas
        }
        requiredFields[input.name] = schema;
    }

    const validationSchema = Yup.object({ ...requiredFields });

    let valoresIniciales = initialValues;

    if (registro) {
        valoresIniciales = registro.datos;
    }

    // Effects
    useEffect(() => {
        if (registro) {
            setFormDisabled(registro.firmas?.length > 0 || // Tiene alguna firma
                registro.estado === 'CERTIFICADO') // estado es CERTIFICADO

        }
    }, [registro])

    useEffect(() => {
        if (!loading && goBack.current) {
            goBack.current = false
            navigation.goBack()
        }
    }, [loading])

    // Handlers
    const handleSubmitForm = async (values) => {
        let reg
        goBack.current = true

        if (registro) {
            reg = { ...registro }
        } else {
            reg = {
                elemento: id_tag,
                tarea: tarea.id,
                planilla: planilla_id,
                formulario: planilla,
                proyecto: auth.proyecto,
                observaciones: '',
                html: '',
                firmas: [],
                estado: 'EN PROCESO'
            }
        }
        reg.datos = values

        if (submitType.current || submitType.current === 'firmar') {
            const now = new Date()
            reg.firmas = [
                ...reg.firmas,
                {
                    uid: auth.uid,
                    nombre: auth.nombre,
                    cargo: auth.cargo,
                    empresa: auth.empresa,
                    estado: registro.estado,
                    fechaFirma: now.toISOString()
                }
            ]

            reg.estado = reg.firmas.length >= 2 ? 'CERTIFICADO' : 'EN PROCESO'
        }

        if (reg.id) {
            dispatch(updateRegistro(reg))
        } else {
            dispatch(addRegistro(reg))
        }

        //navigation.goBack()
    }

    const handlerGetPDF = async () => {
        if (registro?.id) {
            goBack.current = false
            dispatch(setLoading(true))
            try {
                const uri = await getPDF(registro.id)
                if (uri) {
                    const cUri = await FileSystem.getContentUriAsync(uri)
                    dispatch(setLoading(false))
                    if (Platform.OS === 'android') {
                        IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                            data: cUri,
                            flags: 1,
                        });
                    } else {
                        const canShare = await Sharing.isAvailableAsync()
                        if (canShare) {
                            Sharing.shareAsync(cUri, {
                                UTI: 'com.adobe.pdf'
                            })
                        }
                    }
                } else {
                    alert('No se pudo descargar el archivo')
                }
            } catch (err) {
                console.error(err)
                alert('No se pudo descargar el archivo')
            } finally {
                dispatch(setLoading(false))
            }
        }
    }

    if (planilla)
        return (
            <View style={styles.containerFormulario}>
                <ScrollView keyboardShouldPersistTaps='always'>
                    <Formik
                        enableReinitialize
                        initialValues={valoresIniciales}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmitForm}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, touched, errors }) => (
                            <>
                                {planilla.map(({ type, name, placeholder, label, options, items }, index) => {
                                    switch (type) {
                                        case 'input':
                                        case 'password':
                                        case 'email':
                                            return <MyTextInput
                                                key={name}
                                                type={type}
                                                name={name}
                                                label={label}
                                                placeholder={placeholder}
                                                onChangeText={handleChange(name)}
                                                editable={!formDisabled}
                                            />
                                        case 'area':
                                            return <MyTextArea
                                                key={name}
                                                type={type}
                                                name={name}
                                                label={label}
                                                placeholder={placeholder}
                                                onChangeText={handleChange(name)}
                                                editable={!formDisabled}
                                            />
                                        case 'titulo':
                                        case 'label':
                                        case 'subtitulo':
                                            return <MyText
                                                key={name}
                                                name={name}
                                                label={label}
                                                type={type}
                                            />
                                        case 'select':
                                            return <MySelect
                                                key={name}
                                                name={name}
                                                label={label}
                                                options={options}
                                                onValueChange={value => setFieldValue(name, value, true)}
                                                enabled={!formDisabled}
                                            />
                                        case 'radiobuttongroup':
                                        case 'checkgroup':
                                            return <MyRadioButtonGroup
                                                key={name}
                                                name={name}
                                                label={`${index} - ${label}`}
                                                onValueChange={value => setFieldValue(name, value, true)}
                                                disabled={formDisabled}
                                            />
                                        case 'date':
                                            return <MyDatePicker
                                                key={name}
                                                name={name}
                                                label={label}
                                                placeholder={placeholder}
                                                onValueChange={value => setFieldValue(name, value, true)}
                                                disabled={formDisabled}
                                            />
                                        case 'list':
                                            return <MyList
                                                key={name}
                                                name={name}
                                                items={items}
                                                disabled={formDisabled} />
                                    }
                                })}
                                {!formDisabled &&
                                    <Button
                                        title='Guardar'
                                        onPress={() => {
                                            submitType.current = undefined;
                                            handleSubmit()
                                        }} />
                                }
                                {registro && registro.estado!=='CERTIFICADO' && !registro?.firmas?.some(({ uid }) => uid === auth.uid) && // Firmado por mi
                                    <View style={styles.marginTop10}>
                                        <Button
                                            title='Firmar'
                                            onPress={() => {
                                                submitType.current = 'firmar';
                                                handleSubmit()
                                            }} />
                                    </View>}
                                {(Platform.OS === 'android' || Platform.OS === 'ios') && (registro?.firmas?.length >= 2 || registro?.estado === 'CERTIFICADO') &&
                                    <View style={styles.marginTop10}>
                                        <Button
                                            title='DESCARGAR PDF'
                                            onPress={handlerGetPDF}
                                        />
                                    </View>}
                            </>)
                        }
                    </Formik>
                </ScrollView>
                <StatusBar style='dark' />
            </View>
        )

    return null
}

export default RegistroFormulario