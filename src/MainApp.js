import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNetInfo } from "@react-native-community/netinfo";

// Components
import OfflineNotice from './components/OfflineNotice';

// Navigation
import Navigator from './navigation';

// Styles
import { styles } from './styles'

const MainApp = () => {
    const netInfo = useNetInfo()    

    return (
        <View style={{flex: 1}}>
            <SafeAreaView style={styles.mainContainer}>
                <Navigator offline={netInfo.type !== "unknown" && !netInfo.isInternetReachable} />
                <OfflineNotice offline={netInfo.type !== "unknown" && !netInfo.isInternetReachable} />
            </SafeAreaView>    
            <StatusBar style='auto' />
        </View>
    )
}

export default MainApp