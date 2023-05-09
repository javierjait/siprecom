import { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { startLogin } from '../store/actions/auth'

// 3rd party components
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Feather } from '@expo/vector-icons'

// styles
import { styles } from '../styles'
import LogoSiprecom from '../../assets/logos/Logo-Siprecom-Negro.png'
import { colors } from '../styles/colors';

const Login = () => {
    // Redux
    const dispatch = useDispatch()
    const { checking, authError } = useSelector(state => state.auth)

    useEffect(() => {
        if (authError !== '') {
            alert(JSON.stringify(authError))
        }
    }, [authError])

    return (
        <View style={styles.containerLogin}>            
            <View style={{
                alignItems: 'center'
            }}>
                <Feather
                    name="unlock"
                    size={30}
                    color={colors.iconColor} />
                <Image
                    style={{
                        width: '90%',
                    }}
                    resizeMode='contain'
                    source={LogoSiprecom}
                />
            </View>
            <Formik
                initialValues={{ email: 'siprecom@siprecom.com', password: '123456' }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Debe ser un mail').max(255).required('Email es requerido'),
                    password: Yup.string().max(255).required('Password es requerido')
                })}
                onSubmit={values => {
                    Keyboard.dismiss()
                    dispatch(startLogin(values.email, values.password))
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
                    <View>
                        <View style={{ marginBottom: 10 }}>
                            <TextInput
                                style={styles.input}
                                placeholder='Email Address / Username'
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                keyboardType='email-address'
                                autoCapitalize='none'
                            />
                            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <TextInput
                                style={styles.input}
                                placeholder='Password'
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry={true}
                            />
                            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
                        </View>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => {
                                handleSubmit()
                            }}
                            disabled={checking}
                        >
                            <Text style={[styles.buttonText,
                            { marginRight: 5 }]}>INGRESAR</Text>
                            <ActivityIndicator
                                size='small'
                                animating={checking}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
            <StatusBar 
                style='dark'
                backgroundColor={colors.navBackground}
                 />
        </View>
    )
}

export default Login