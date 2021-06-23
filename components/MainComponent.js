import React, { Component } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    FlatList, 
    Image, 
    Button, 
} from 'react-native';
import {Linking} from 'react-native';
import Spinner from '../assets/spinner.svg';

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
const CustomListView = ({itemList, toggleModal, modalVisible, setImage}) => {
    return(
    <View style={styles.issuesHolder}>
        <FlatList
            keyExtractor={item => item.id.toString()}
            data={itemList}
            
            initialNumToRender={5}
            renderItem={({item}) => {
                return(
                <CustomView
                    name={item.volume.name}
                    image_url={item.image.original_url}
                    issue={item.issue_number}
                    link={item.site_detail_url}
                    year={item.cover_date ? item.cover_date : "N/A"}
                    toggleModal={toggleModal}
                    modalVisible={modalVisible}
                    setImage={setImage}
                />
                )
            }}
        />
    </View>
    )}

//create class to hold state and render list
class Main extends Component {
    //create constructor to hold props
    constructor(props) {
        //grab props from parent
        super(props);
        this.state = {
            //holds all issues returned from api call
            allIssues : [],
            //holds number of results from api call
            totalResults: 0,
            //holds loading value to show loading animation
            isLoading: true,
            //holds offset for api call
            apiOffset: 0
        }
    }

    toggleModal = () => {
        this.setState({modalVisible: !this.state.modalVisible});
        console.log(this.state.modalVisible);
    }

    apiCall(offset) {
        //fetch call to api from comic vine website using proxy to get around cors - with api key
        fetch('https://proxy-cors-anywhere.herokuapp.com/https://www.comicvine.com/api/issues?api_key=65c3e7b3c65af20fbfe03bb5d0cd0b8e83e9fb1a&format=json&offset=' + offset)
        //turn response into json
        .then(response => 
            response.json()
        )
        .then(data => {
            //for looking at object structure
            console.log(data);
            this.setState({totalResults: data.number_of_total_results});
            //store results in array
            const newArray = data.results;
            //update state with array
            this.setState({allIssues: newArray});
            //once info is stored we can change isloading to false to render data
            this.setState({isLoading: false});
        })
        //catch any errors
        .catch((error) => {
            console.error(error);
        });
    }

    componentDidMount() {
        this.apiCall(0);
    }

    //render method
    render() { 
        //check if api is done loading
        console.log(this.state.modalVisible);
        if(this.state.isLoading) {
            return(
                <View>
                    <img src={Spinner}/>
                </View>
            )
        }
         
        else {
            return (
                <>
                <View>
                    <Button
                        onPress={() => {
                            //set new ofset value then pass that into api call function on second param
                            var newNum = this.state.apiOffset - 100;
                            this.setState({apiOffset: newNum}, () => {
                                this.setState({isLoading: true});
                                this.apiCall(this.state.apiOffset);
                            });
                        }}
                        disabled={this.state.apiOffset === 0 ? true : false}
                        title="prev"
                    />
                    <Button
                        onPress={() => {
                            //set new ofset value then pass that into api call function on second param
                            var newNum = this.state.apiOffset + 100;
                            
                            this.setState({apiOffset: newNum}, () => {
                                this.setState({isLoading: true});
                                this.apiCall(this.state.apiOffset);
                            });
                        }}
                        title="next"
                    />
                    <Text style={styles.detail}>TOTAL RESULTS: {this.state.totalResults}</Text>
                    <Text style={styles.detail}>Viewing: {this.state.apiOffset} - {this.state.apiOffset + 100}</Text>
                    {/*Render api results*/}
                    {console.log("about to render list")}
                    <CustomListView 
                        itemList={this.state.allIssues}
                        modalVisible={this.state.modalVisible}
                        toggleModal={this.toggleModal} 
                        setImage={this.setImage}  
                    />
                </View></>);  
        }
    }
}
//Stylesheet for page
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
        fontWeight: 500,
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
        fontWeight: 400,
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
  
export default Main;