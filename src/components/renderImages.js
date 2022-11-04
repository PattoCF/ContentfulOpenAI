import React from 'react';
import { Paragraph } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';




export default class RenderImages extends React.Component{
  constructor(props){
    super(props)
    this.state = {
    }
  }
  
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();
  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/

  render = () => {
    debugger
    let jsxConstruct = []
    if(this.props.openai !== undefined) {
        this.props.openai.data.data.forEach(data => {
            jsxConstruct.push(
                <img src={data.url}/>
            )
        });
    }


  return (
    <div>
        {jsxConstruct}
        </div>
  )
  }
}

