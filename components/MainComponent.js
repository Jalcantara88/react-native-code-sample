import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Image, StatusBar } from 'react-native';

const CustomView = ({name, image_url, issue, link}) => (
    <View style={styles.resultHolder} >
        <img src={image_url} style={{width: '200px'}}/>
        <View style={styles.containerText}>
            <Text style={styles.name}>
                {name}
            </Text>
            <Text style={styles.issue}>
                {issue}
            </Text>
            <a href={link}>link</a>
        </View>
    </View>
)

const CustomListView = ({itemList, filteredList}) => (
    <View style={styles.issuesHolder}>
        <FlatList
            keyExtractor={item => item.id.toString()}
            data={itemList}
            extraData={filteredList}
            renderItem={({item}) => 
                <CustomView
                    name={item.volume.name}
                    image_url={item.image.original_url}
                    issue={item.issue_number}
                    link={item.site_detail_url}
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
            
            allImages: {},
            //holds loading value to show loading animation
            isLoading: true
        }
        
        //fetch call to api from comic vine website using proxy to get around cors - with api key
        fetch('https://proxy-cors-anywhere.herokuapp.com/https://www.comicvine.com/api/issues?api_key=65c3e7b3c65af20fbfe03bb5d0cd0b8e83e9fb1a&format=json')
        //grab text from api response
        .then(response => 
            //console.log(response.json());
            response.json()
        )
        //parse data
        //.then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            //grab node list of useable data
            //const issueNodeList = data.querySelectorAll("issue");
            console.log(data);
            //convert nodelist to an array
            const newArray = data.results;
            //const newArray = Array.from(issueNodeList);
            //console.log(newArray[0].querySelector("image").querySelector("thumb_url").childNodes[0].data);
            //update state with array
            this.setState({allIssues: newArray});

            const allRenderedImages = this.state.allIssues.map((item, i) => {
                const name = item.volume.name;
                const imageSrc = item.image.thumb_url;
                const issueNum = item.issue_number;
                const linkUrl = item.site_detail_url;
                const details = item.description;
                //const imageSrc = item.querySelector("image").querySelector("thumb_url").childNodes[0].data;
                //const linkUrl = item.querySelector("api_detail_url").childNodes[0] ? item.querySelector("api_detail_url").childNodes[0].data : "";
                
                //console.log(item.querySelector("description").childNodes[0].data);
                //const name = item.querySelector("name").childNodes[0] ? item.querySelector("name").childNodes[0].data : "";
                //console.log(imageSrc);
                return(
                    <div key={i}>
                        <img src={imageSrc}/>
                        <Text>{name}</Text>
                        
                        <a href={linkUrl}>more details</a>
                    </div>
                );
            });
            
            this.setState({allImages: allRenderedImages});

            this.setState({isLoading: false});

            //console.log(this.state.allIssues);
        })
        //catch any errors
        .catch((error) => {
            console.error(error);
        });
         
        
    }
    
    
    //render method
    render() {
        
        //check if api is done loading
        if(this.state.isLoading) {
            return(
                <>
                    the api call is isLoading
                </>
            )
        }

        else {
            return (<>
                <CustomListView 
                    itemList={this.state.allIssues}
                    filteredList={this.state.filteredList}    
                />
            </>);
        }
    }
}

const styles = StyleSheet.create({
    resultHolder: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 5,
        backgroundColor: '#fff',
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: 10
    },
    issuesHolder: {
        flex: 1
    },
    name: {
        fontSize: 26,
        fontWeight: 500,
        color: '#000'
    },
    containerText: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 22,
        justifyContent: 'center'
    },
   
  });
  

export default Main;