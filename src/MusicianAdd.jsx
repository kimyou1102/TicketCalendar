import React, { useState, useEffect, useRef } from "react";
import {
  MusicianAddWrap,
  ListText,
  MusicianAddForm,
  MusicianAddInfo,
  InputInfo,
  MusicianAddInput,
  MusicianColorWrap,
  MusicianColorLabel,
  MusicianColorInput,
  BtnWrap,
  CancleBtn,
  AddBtn,
  MusicianAddBtn,
  ArtistUl,
  ArtistLi,
  ArtistNameWrap,
  ArtistNameText,
  ArtistColor,
  DeleteBtn,
  ArtistEmptyWrap,
  ArtistEmptyText,
  ArtistEmptySubText,
  CalendarMoveBtn,
  CalendarLink,
  CalendarPageText,
} from "./styledComponents";
import axios from "axios";
import { getArtists } from "./dataAction";
import { useDispatch, useSelector } from "react-redux";
import { faCirclePlus, faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MusicianAdd = () => {
  const [value, setValue] = useState("");
  const [show, setShow] = useState("none");
  const [emptyTextShow, setEmptyTextShow] = useState('block');
  const [color, setColor] = useState('');

  const colorInput = useRef();

  const submit = (e) => {
    e.preventDefault();
    if (value === "") return;
    const colorValue = colorInput.current.value === '#000000' ? color : colorInput.current.value
    
    axios
      .post("http://kimyugyeong.pythonanywhere.com/api/artist", {
        name: value,
        color: colorValue
      })
      .then((res) => {
        console.log(res.data);
        getArtists().then((result) => {
            dispatch(result);
        });
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`http://kimyugyeong.pythonanywhere.com/getTicketDatas/${value}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

    getArtists().then((result) => {
      console.log(result);
        dispatch(result);
    });

    setValue("");
  };

  const addClick = () => {
    setShow("block");
    if(artists.length === 0) {
      setEmptyTextShow('none');
    }
  };

  const cancleClick = () => {
    setShow("none");
    setValue("");
    if(artists.length === 0) {
      setEmptyTextShow('block');
    }
  };

  const artistDeleteClick = (e) => {
    const id = Number(e.target.closest('li').id);
    if(window.confirm('?????????????????????????')) {
      axios
      .delete(`http://kimyugyeong.pythonanywhere.com/api/artist/${id}`)
      .then((res) => {
        dispatch({
            type: "DELETE_ARTIST",
            payload: id,
        })
      })
      .catch((error) => {
        console.log(error);
      });
      alert('?????????????????????.');
    } else {
      alert('?????????????????????.');
    }
    
  }
  
  const colorChange = (e) => {
    console.log(e.target.value);
    setColor(e.target.value);
  }

  const artists = useSelector((state) => state.artists.artists) ?? [];

  const dispatch = useDispatch();

  useEffect(() => {
    getArtists().then((result) => {
      dispatch(result);
    });

    setColor('#' + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, '0'));
  }, [dispatch]);

  // console.log(performanceData);
  console.log(artists);

  return (
    <MusicianAddWrap>
      <ListText>List</ListText>
      <MusicianAddBtn onClick={addClick}>
        <FontAwesomeIcon
          icon={faCirclePlus}
          style={{ fontSize: "23px", color: "gray" }}
        />
      </MusicianAddBtn>
      <MusicianAddForm onSubmit={submit} style={{ display: `${show}` }}>
        <MusicianAddInfo>?????????</MusicianAddInfo>
        <InputInfo>???? ????????? ????????? ?????? ???????????? ???????????? ???????????????.</InputInfo>
        <MusicianAddInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <MusicianAddInfo>??????</MusicianAddInfo>
        <MusicianColorWrap>
          <MusicianColorLabel htmlFor="colorPicker" color={color}/>
          <MusicianColorInput type="color" name="color" id="colorPicker" onChange={colorChange} ref={colorInput}/>
        </MusicianColorWrap>
        <BtnWrap>
          <CancleBtn onClick={cancleClick} type="button">??????</CancleBtn>
          <AddBtn width="49%" float="right">??????</AddBtn>
        </BtnWrap>
      </MusicianAddForm>
      {artists.length !== 0 ? (
        <>
          <ArtistUl>
            {artists.map((artist, index) => (
              <ArtistLi key={index} id={artist.id}>
                <ArtistNameWrap>
                  <ArtistColor color={artist.color} />
                  <ArtistNameText>{artist.name}</ArtistNameText>
                </ArtistNameWrap>
                <DeleteBtn onClick={artistDeleteClick}>??????</DeleteBtn>
              </ArtistLi>
            ))}
          </ArtistUl>
          <CalendarMoveBtn>
            <CalendarLink to="/calendar">
              <CalendarPageText>???????????? ?????? ?????? ??????</CalendarPageText>
              <FontAwesomeIcon
                icon={faArrowRightLong}
                style={{ fontSize: "18px", color: "white" }}
              />
            </CalendarLink>
          </CalendarMoveBtn>
        </>  
      ) :
        <ArtistEmptyWrap show={emptyTextShow}>
          <ArtistEmptyText>???????????? ????????? ?????????.</ArtistEmptyText>
          <ArtistEmptySubText>??????????????? ?????? ?????? ????????? ??????????????????.</ArtistEmptySubText>    
        </ArtistEmptyWrap>
      }
    </MusicianAddWrap>
  );
};

export default MusicianAdd;

