import React, { Component } from 'react';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allIssues : [],
            allImages: {},
            isLoading: true
        }
        
        //fetch call to api from comic vine website
        fetch('https://proxy-cors-anywhere.herokuapp.com/https://www.comicvine.com/api/issues?api_key=65c3e7b3c65af20fbfe03bb5d0cd0b8e83e9fb1a').then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            const issueNodeList = data.querySelectorAll("issue");
            const newArray = Array.from(issueNodeList);
            //console.log(newArray[0].querySelector("image").querySelector("thumb_url").childNodes[0].data);

        this.setState({allIssues: newArray});

        const allRenderedImages = this.state.allIssues.map(item => {
            const imageSrc = item.querySelector("image").querySelector("thumb_url").childNodes[0].data
            //console.log(imageSrc);
            return(
                <div key={imageSrc}>
                    <img src={imageSrc}/>
                </div>
            );
        });
        this.setState({allImages: allRenderedImages});

        this.setState({isLoading: false});

        //console.log(this.state.allIssues);
        })
        .catch((error) => {
            console.error(error);
        });
         
    }
    
    render() {
        
        if(this.state.isLoading) {
            return(
                <>
                    the api call is isLoading
                </>
            )
        }

        else {
        return (<>
            {this.state.allImages};
        </>);
        }
    }
}

export default Main;