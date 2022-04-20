import * as React from "react";
import { Row, Col } from "react-bootstrap";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { green, red } from "@mui/material/colors";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import image from "../../../assets/images/keylime.jpg";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import Readmore from "./ReadMore";
import countryPosition from "../../../data/CountriesUpdated.json";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NumbersIcon from '@mui/icons-material/Numbers';

function importAll(r) {
  let images = {};
  r.keys().map((item) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const images = importAll(
  require.context("../../../assets/images/flagpng", false, /\.(png|jpe?g|svg)$/)
);

export default function RecipeReviewCard(props) {

  const [expanded, setExpanded] = React.useState(false);

  const [lgShow, setLgShow] = useState(false);

  // Fav = true, then display BookmarkIcon
  const [FavFlag, setFavFlag] = useState(props.fav);
  let x = <BookmarkBorderIcon />;

  // if already fav'd
  if (props.fav) x = <BookmarkIcon />;

  const [bookImage, setbookImage] = useState(x);


   // Heart = true, then display HeartIcon
   const [HeartFlag, setHeartFlag] = useState(props.fav);
   let y = <FavoriteBorderIcon />;
 
   // if already heart'd
   if (props.like) y = <FavoriteIcon />;
 
   const [heartImage, setheartImage] = useState(y);

  const app_name = "reci-pin";
  function buildPath(route) {
    if (process.env.NODE_ENV === "production")
      return "https://" + app_name + ".herokuapp.com/" + route;
    else return "http://localhost:5000/" + route;
  }

  const setLike = async () => {
    let jsonPayLoad = JSON.stringify({
      userID: JSON.parse(window.localStorage.getItem("userObject"))["_id"],
      recipeID: props.recipe["_id"],
    });

    console.log(jsonPayLoad);

    try {
      // Do not await fetches anymore
      const response = await fetch(buildPath("api/addLike"), {
        method: "POST",
        body: jsonPayLoad,
        headers: {
          "Content-Type": "application/json",
          "x-access-token": JSON.parse(
            window.localStorage.getItem("userObject")
          )["token"],
        },
      });

      let res = JSON.parse(await response.text());

      if (res.hasOwnProperty("error")) console.log(res["error"]);

      setheartImage(<FavoriteIcon />);
      setHeartFlag(!HeartFlag);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteLike = async () => {
    let jsonPayLoad = JSON.stringify({
      userID: JSON.parse(window.localStorage.getItem("userObject"))["_id"],
      recipeID: props.recipe["_id"],
    });

    console.log(jsonPayLoad);

    try {
      // Do not await fetches anymore
      const response = await fetch(buildPath("api/deleteLike"), {
        method: "POST",
        body: jsonPayLoad,
        headers: {
          "Content-Type": "application/json",
          "x-access-token": JSON.parse(
            window.localStorage.getItem("userObject")
          )["token"],
        },
      });

      let res = JSON.parse(await response.text());

      if (res.hasOwnProperty("error")) console.log(res["error"]);

      setheartImage(< FavoriteBorderIcon/>);
      setHeartFlag(!HeartFlag);
    } catch (e) {
      console.log(e);
    }
  };

  const setFav = async () => {
    let jsonPayLoad = JSON.stringify({
      userID: JSON.parse(window.localStorage.getItem("userObject"))["_id"],
      recipeID: props.recipe["_id"],
    });

    console.log(jsonPayLoad);

    try {
      // Do not await fetches anymore
      const response = await fetch(buildPath("api/addFavorite"), {
        method: "POST",
        body: jsonPayLoad,
        headers: {
          "Content-Type": "application/json",
          "x-access-token": JSON.parse(
            window.localStorage.getItem("userObject")
          )["token"],
        },
      });

      let res = JSON.parse(await response.text());

      if (res.hasOwnProperty("error")) console.log(res["error"]);

      console.log("SET AS FAVORITE");
      console.log("shit");
      setFavFlag(true);
      props.favMethod((prevItems) => {
        console.log(prevItems);
        prevItems.set(props.recipe["_id"], props.recipe);
        console.log(prevItems);
        return prevItems;
      });
      setbookImage(<BookmarkIcon />);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteFav = async () => {
    let jsonPayLoad = JSON.stringify({
      userID: JSON.parse(window.localStorage.getItem("userObject"))["_id"],
      recipeID: props.recipe["_id"],
    });

    console.log(jsonPayLoad);

    try {
      // Do not await fetches anymore
      const response = await fetch(buildPath("api/deleteFavorite"), {
        method: "POST",
        body: jsonPayLoad,
        headers: {
          "Content-Type": "application/json",
          "x-access-token": JSON.parse(
            window.localStorage.getItem("userObject")
          )["token"],
        },
      });

      let res = JSON.parse(await response.text());

      if (res.hasOwnProperty("error")) console.log(res["error"]);

      console.log("set as unfav");
      setbookImage(<BookmarkBorderIcon />);
      setFavFlag(false);
      props.favMethod((prevItems) => {
        prevItems.delete(props.recipe["_id"]);
        return prevItems;
      });
    } catch (e) {
      console.log(e);
    }
  };

  let picture = props.recipe.pic

  if (picture == null || picture == "")
    picture = "https://image.shutterstock.com/image-vector/picture-vector-icon-no-image-260nw-1350441335.jpg"

  return (
    <>
      <Modal
        style={{ zIndex: "5000", marginTop: "1.7%" }}
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            {props.recipe.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Readmore recipe = {props.recipe} />
        </Modal.Body>
      </Modal>

      <Card sx={{ maxWidth: 345, minWidth: 300 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: green[500] }} aria-label="recipe">
              {countryPosition.map((countryYoink) => (
                <>
                  <img src={images[countryYoink.id.toLowerCase() + ".png"]} />
                </>
              ))}
            </Avatar>
          }
          action={
            <IconButton
              aria-label="settings"
              onClick={() => {
                FavFlag ? deleteFav() : setFav();
              }}
            >
              {bookImage}
            </IconButton>
          }
          title= {props.recipe.name}
          // subheader="September 14, 2016"
        />

        <CardContent>
          <Row>
            <CardMedia
              component="img"
              height="180"
              image={picture}
             
              alt="No Image"
            />
          </Row>

          <Row>
            <Typography variant="body2" color="text.secondary">
              {props.recipe.desc}
            </Typography>
          </Row>

          <Row>
            <Col>
              <IconButton
                aria-label="add to favorites"
                onClick={() => {
                  HeartFlag ? deleteLike() : setLike();
                }}
              >
               {heartImage}
              </IconButton>
              {/* 
                <IconButton aria-label="share" onClick={() => setLgShow(true)}>
                  <NumbersIcon/>
                </IconButton> */}
            </Col>

            <Col></Col>

            <Col md={{ offset: 4 }}>
              <IconButton onClick={() => setLgShow(true)}>
                <ReadMoreIcon aria-label="show more"> </ReadMoreIcon>
              </IconButton>
            </Col>
          </Row>
        </CardContent>
        <CardActions disableSpacing></CardActions>
      </Card>
    </>
  );
}
