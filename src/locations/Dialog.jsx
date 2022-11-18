import React, { useState } from "react";
import { Button, Paragraph, Stack, Switch } from "@contentful/f36-components";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import { PlusCircleIcon, CheckCircleIcon } from "@contentful/f36-icons";

// import { CloseIcon } from '@contentful/f36-icons';

const Dialog = () => {
  const sdk = useSDK();
  const cma = useCMA();
  const parameters = sdk.parameters.invocation;
  const [isGenerating, setIsGenerating] = useState(false);
  const [toPublish, setPublish] = useState(false);

  let helperArray = [];
  parameters.urls.forEach((url, i) => {
    helperArray.push({
      url: url,
      i: i,
      selected: false,
      add: true,
    });
  });

  const [images, setImages] = useState({
    images: helperArray,
  });

  const toggleImage = (url, i) => {
    let helperArray = { ...images };
    helperArray.images[i] = {
      url: url,
      i: i,
      selected: !helperArray.images[i].selected,
      add: !helperArray.images[i].add,
    };
    setImages(helperArray);
  };

  let createAssets = async () => {
    setIsGenerating(true);
    const spaceEnvProps = {
      spaceId: sdk.ids.space,
      environmentId: sdk.ids.environment,
    };

    const assetToUpload = {
      fields: {
        title: {
          "en-US": "Images",
        },
        description: {
          "en-US": "desc",
        },
        file: {
          "en-US": {
            contentType: "image/png",
            fileName: "example.png",
            upload: "",
          },
        },
      },
    };
    let assetIds = [];

    for (let i = 0; i < images.images.length; i++) {
      if (images.images[i].selected === true) {
        assetToUpload.fields.file["en-US"].upload = images.images[i].url;

        const asset = await cma.asset.create(spaceEnvProps, assetToUpload);
        const processedAsset = await cma.asset.processForAllLocales(
          spaceEnvProps,
          asset
        );
        if (toPublish) {
          //const publishedAsset =
          await cma.asset.publish(
            { ...spaceEnvProps, assetId: processedAsset.sys.id },
            processedAsset
          );
        }

        assetIds.push(processedAsset.sys.id);
      }
    }
    setIsGenerating(false);
    sdk.close(assetIds);
  };

  return (
    <div>
      <Stack
        id="stack"
        justifyContent="center"
        marginTop="spacingM"
        marginBottom="spacingM"
        flexDirection="column"
      >
        <Paragraph>
          Your prompt <strong>"{parameters.prompt}"</strong> returned in the
          following images.
        </Paragraph>
        <Stack
          id="stack"
          justifyContent="center"
          marginTop="spacingM"
          marginBottom="spacingM"
        >
          {parameters.urls.map((key, i) => {
            return (
              <div>
                <div>
                  <img
                    className="openAiImage"
                    src={key.url}
                    key={i}
                    alt={"openAI" + i}
                    onClick={() => toggleImage(key.url, i)}
                  />
                </div>
                <CheckCircleIcon
                  style={{
                    display:
                      images.images[i].selected === true ? "block" : "none",
                  }}
                  className="imageSelected"
                  size="xlarge"
                  onClick={() => toggleImage(key.url, i)}
                />
                <PlusCircleIcon
                  style={{
                    display: images.images[i].add === true ? "block" : "none",
                  }}
                  className="imageNotSelected"
                  size="xlarge"
                  onClick={() => toggleImage(key.url, i)}
                />
              </div>
            );
          })}
        </Stack>
        <Paragraph>
          Select the images you would like to turn into Contentful assets. The
          assets will be created in Contentful and linked.
        </Paragraph>
        <Switch
          name="allow-cookies-controlled"
          id="allow-cookies-controlled"
          isChecked={toPublish}
          onChange={() => setPublish((prevState) => !prevState)}
        >
          Check to publish assets right away
        </Switch>{" "}
        <Button
          isLoading={isGenerating}
          isDisabled={isGenerating}
          variant="primary"
          onClick={() => createAssets()}
        >
          Create Selected Assets
        </Button>
      </Stack>
    </div>
  );
};

export default Dialog;
