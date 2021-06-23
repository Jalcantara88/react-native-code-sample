import React, { Component } from 'react';
import { 
    StyleSheet, 
    Text, 
    View,  
    Button, 
} from 'react-native';
//animated svg for when loading
import Spinner from '../assets/spinner.svg';
//custom render view for displaying api results
import CustomListView from './CustomView';

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
    detail: {
        fontSize: 25,
        fontWeight: 500,
        padding: 5,
        textAlign: 'center'
    }
  });
  
export default Main;