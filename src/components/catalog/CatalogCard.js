import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardText, CardMedia, CardTitle} from 'material-ui/Card';
import ReactHtmlParser from 'react-html-parser';
import {Link} from "react-router-dom";
import RaisedButton from 'material-ui/RaisedButton';

const style = {
    'max-width': '50%',
    'min-width': '20%',
    'border': '2px solid #020202;'
};

export const CatalogCard = props => (

    <Card
        fullWidth={true}
        className="catalog-card"
        expandable={true}
        expanded={props.expanded}
    >
        <CardHeader
            title={props.item.name}
            subtitle={"v." + props.item.version}
            actAsExpander={true}
            showExpandableButton={true}
            className="catalog-card-header"
        />

        <CardMedia
            expandable={true}
        >
            {props.item.logo && <img src={props.item.logo} alt={props.item.name}  style={style}/>}
        </CardMedia>

        <CardText expandable={true}>
            <p>About:</p>
            <div className="catalog-item-description">
                { ReactHtmlParser(props.item.description) }
            </div>
            <p>Type: {props.item.type}</p>
            <p>Version: {props.item.version}</p>
            {
                props.item.lastUpdate &&
                <p>Last Update: {new Date(props.item.lastUpdate).toLocaleDateString()}</p>
            }
            <p>Is Paid: {props.item.isPaid ? "Yes" : "No"}</p>
            {
                props.item.pageLink &&
                <RaisedButton label="documentation"
                              linkButton={true}
                              href={props.item.pageLink}
                              target="_blank"
                />
            }
        </CardText>
        <CardActions>
            <RaisedButton label={props.button.label} primary={true}
                          containerElement={<Link to={
                              {
                                  pathname: props.button.path,
                                  itemData: props.item
                              }
                          }
                          />
                          }

            />

        </CardActions>
    </Card>
);
