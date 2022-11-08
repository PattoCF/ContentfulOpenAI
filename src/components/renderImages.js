import React from "react";
import { Modal, Heading, Paragraph, Stack } from "@contentful/f36-components";
//import { FieldExtensionSDK } from '@contentful/app-sdk';
//import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';

export default class RenderImages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    let openModal = (url, i) => {
      debugger;
      let modal = document.getElementById("myModal" + i);
      let img = document.getElementById("myImg" + i);
      var modalImg = document.getElementById("img" + i);
      modal.style.display = "block";
      modalImg.src = url;
    };

    let closeModal = (url, i) => {
      debugger;
      let modal = document.getElementById("myModal" + i);

      modal.style.display = "none";
    };

    let jsxConstruct;
    jsxConstruct =
      this.props.urls === undefined
        ? ""
        : this.props.urls.map(function (key, i) {
            return (
              <div>
                <img
                  id={"myImg" + i}
                  alt="open AI generated"
                  className="openAiImage"
                  src={key.url}
                  onClick={() => openModal(key.url, i)}
                />
                <div id={"myModal" + i} class="modal">
                  <span class="close" onClick={() => closeModal(key.url, i)}>
                    &times;
                  </span>

                  <img class="modal-content" id={"img" + i} />
                </div>
              </div>
            );
          });

    return <Stack>{jsxConstruct}</Stack>;
  };
}
