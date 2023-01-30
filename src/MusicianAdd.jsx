import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MusicianAddInput, AddBtn } from './styledComponents';
import axios from 'axios';
import { getData, getArtists } from "./dataAction";
import { useDispatch, useSelector } from "react-redux";

const MusicianAdd = () => {
    const [value, setValue] = useState('');
    const submit = (e) => {
        e.preventDefault();
        if(value === '') return;

        axios.post('http://127.0.0.1:8000/api/artist', {
            name: value
        })
        .then((res) => {
            console.log(res.data);
        })
        .catch((error) => {
            console.log(error);
        })
        setValue('');
    }

    const performanceData = useSelector((state) => state.performances.performanceData) ?? [];
    const artists = useSelector((state) => state.artists.artists) ?? [];

    const dispatch = useDispatch();


    useEffect(() => {
      getData().then((result) => {
        dispatch(result);
      });
    
      getArtists().then((result) => {
        dispatch(result);
      })
    },[]);

    console.log(performanceData);
    console.log(artists);

    return (
        <div>
            <h1>가수들 추가하는 페이지</h1>
            <Link to="/calendar">
                <h2>공연예매 달력 보러 가기🌹</h2>
            </Link>
            <form onSubmit={submit}>
                <MusicianAddInput value={value} onChange={(e) => {
                    setValue(e.target.value);
                }}/>
                <AddBtn width={'50%'}>추가하기</AddBtn>
            </form>            
        </div>
    );
};

export default MusicianAdd;