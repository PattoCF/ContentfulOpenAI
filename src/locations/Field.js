import React from 'react';
import { Paragraph } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useCMA, useSDK } from '@contentful/react-apps-toolkit';
import RenderImages from '../components/renderImages';


/*

- config page
-- how many picture to show
-- API key

- Field level app
- type (new picture or outpainting) --> not sure if available via API yet

-- text box to submit request
-- type of request (oil painting, etc.)
-- show based on config x number of pictures 

- user selects on or many images? 
- create asset(s) based on URL 

- present to SE/PS/Demo team 

*/



const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  //use config here
  apiKey: "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"
});
const openai = new OpenAIApi(configuration);

export default class Fields extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      openai : undefined
    }
    this.response = this.response.bind(this)
  }
  
  response = async () => {
    debugger
    let openai2 = await openai.createImage({
    prompt: "A cute baby sea otter",
    //use config here
    n: 2,
    size: "1024x1024",
  });

  if(openai2 !== this.state.openai) {
      this.setState({
        openai : openai2
      })
    }
  }
  sdk = useSDK;
  cma = useCMA;
  render = () => {

    this.response()
  return <RenderImages openai={this.state.openai}/>
  }
}

