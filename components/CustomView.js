import React from 'react';
import {Linking} from 'react-native';
import {FlatList, Image, View, Text, StyleSheet} from 'react-native';

{/*Custom display for FlatList renderItem*/}
const CustomView = ({name, image_url, issue, link, year}) => {
    return(
        <>
            {/*basic card view*/}
            <View style={styles.resultHolder} >
                <Image source={{uri: image_url}} style={styles.image}/>
                {/*Info Display*/}
                <View style={styles.containerText}>
                    {/*Name*/}
                    <View style={styles.labelGroup}>
                        <Text style={styles.label}>name: </Text>
                        <Text style={styles.detail}>
                            {name}
                        </Text>
                    </View>
                    {/*Issue Number*/}
                    <View style={styles.labelGroup}>
                        <Text style={styles.label}>issue #: </Text>
                        <Text style={styles.detail}>
                            {issue}
                        </Text>
                    </View>
                    {/*Year Released*/}
                    <View style={styles.labelGroup}>
                        <Text style={styles.label}>year: </Text>
                        <Text style={styles.detail}>
                            {year}
                        </Text>
                    </View>
                    {/*open link to comicVine website showcasing this issue*/}
                    <Text style={styles.linkButton} onPress={() => Linking.openURL(link)}>
                        MORE DETAILS
                    </Text>
                </View>
            </View>
        </>
    )
}

{/*Custom list view that uses flatlist to iterate over array holding api response*/}
const CustomListView = ({itemList}) => {
    return(
        <View style={styles.issuesHolder}>
            {/*Use flatlist to call CustomView on every item of itemList*/}
            <FlatList
                keyExtractor={item => item.id.toString()}
                data={itemList}
                renderItem={({item}) => {
                    return(
                        //call custom render method
                    <CustomView
                        name={item.volume.name}
                        image_url={item.image.original_url}
                        issue={item.issue_number}
                        link={item.site_detail_url}
                        year={item.cover_date ? item.cover_date : "N/A"}
                    />
                    )
                }}
            />
        </View>
)}

const styles = StyleSheet.create({
    resultHolder: {
        flex: 1,
        flexDirection: 'row',
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
        elevation: 5,
        backgroundColor: '#fff',
        margin: 5,
        justifyContent: 'center',
        borderRadius: 10
    },
    issuesHolder: {
        flex: 1
    },
    detail: {
        fontSize: 25,
        fontWeight: "500",
        padding: 5,
        textAlign: 'center'
    },
    containerText: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 22,
        justifyContent: 'center'
    },
    linkButton: {
        textDecorationLine: 'none',
        backgroundColor: 'dodgerblue',
        paddingVertical: 5,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: "400",
        borderRadius: 5,
        color: 'white'
    },
    image: {
        width: '200px',
        height: '300px',
        resizeMode: 'cover',
        
    },
    label: {
        backgroundColor: 'crimson',
        color: 'white',
        padding: 3,
        paddingLeft: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    labelGroup: {
        backgroundColor: 'lightpink',
        borderRadius: 5,
        marginBottom: 5,
    },
});

export default CustomListView;
