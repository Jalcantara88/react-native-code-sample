import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Modal, Button, TouchableOpacity } from 'react-native';
import {Linking} from 'react-native';
import Spinner from '../assets/spinner.svg';


const CustomView = ({name, image_url, issue, link, year, toggleModal, modalVisible, setImage }) => {
    return(
        <>
            {/*basic card view*/}
            <View style={styles.resultHolder} >
                
                <TouchableOpacity
                    onPress={() => {
                        setImage(image_url);
                        toggleModal();
                    }}
                >
                    <Image source={{uri: image_url}} style={styles.image}/>
                </TouchableOpacity>
                <View style={styles.containerText}>
                    <View style={styles.labelGroup}>
                        <Text style={styles.label}>name: </Text>
                        <Text style={styles.detail}>
                            {name}
                        </Text>
                    </View>
                    <View style={styles.labelGroup}>
                        <Text style={styles.label}>issue #: </Text>
                        <Text style={styles.detail}>
                            {issue}
                        </Text>
                    </View>
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

const CustomListView = ({itemList, filteredList, toggleModal, modalVisible, setImage}) => (
    <View style={styles.issuesHolder}>
        <FlatList
            keyExtractor={item => item.id.toString()}
            data={itemList}
            extraData={filteredList}
            initialNumToRender={5}
            renderItem={({item}) => 
                <CustomView
                    name={item.volume.name}
                    image_url={item.image.original_url}
                    issue={item.issue_number}
                    link={item.site_detail_url}
                    year={item.cover_date ? item.cover_date : "N/A"}
                    toggleModal={toggleModal}
                    modalVisible={modalVisible}
                    setImage={setImage}
                />}
        />
    </View>
)

//create class to hold state and render list
class Main extends Component {

    //create constructor to hold props
    constructor(props) {
        //grab props from parent
        super(props);
        this.state = {
            //holds all issues returned from api call
            allIssues : [],
            //holds filtered list of issues based on inputs
            filteredList: [],

            selectedImage: null,
            
            totalResults: 0,
            //holds loading value to show loading animation
            isLoading: true,

            modalVisible: false,

            apiOffset: 0
        }

        
        
        
        
    }

    toggleModal = () => {
        this.setState({modalVisible: !this.state.modalVisible});
        console.log(this.state.modalVisible);
    }

    setImage = image => {
        this.setState({selectedImage: image});
        console.log(this.state.selectedImage);
    }

    updateOffset = number => {
        const newNum = this.state.apiOffset + number;
        console.log("new num is " + newNum);
        this.setState({apiOffset: newNum});
        console.log("api offset is " + this.state.apiOffset);
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
        if(this.state.isLoading) {
            return(
                <View>
                    <img src={Spinner}/>
                </View>
            )
        }

        else {
            return (
                <View>
                    {/*
                    <Modal
                        animationType='slide'
                        transparent='true'
                        visible={true}
                        onRequestClose={() => this.toggleModal()}    
                    >
                        <View style={styles.modalView}>
                            <Image style={styles.modalImage} source={{uri: this.state.selectedImage}}/>
                        </View>
                    </Modal>
                    */}
                    <Button
                        onPress={() => {
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

                    <CustomListView 
                        itemList={this.state.allIssues}
                        filteredList={this.state.filteredList}
                        modalVisible={this.state.modalVisible}
                        toggleModal={this.toggleModal} 
                        setImage={this.setImage}  
                    />
                </View>);
        }
    }
}

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
    modalView: {
        margin: 20,
        borderRadius: 10,
        padding: 30,
    },
    modalImage: {
        width: 400,
        height: 600,
        resizeMode: 'cover'
    }
  });
  
export default Main;