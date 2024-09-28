import {Breadcrumb, Button, Card, Descriptions, Image, Layout, Menu, Row, Space, Spin, theme} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {IMovieDetailsData} from "interfaces/IMovieDetails";
import {useSearchMovieContext} from "context/SearchMovieContext";
import {IMovieData} from "interfaces/IMovieData";
import {DescriptionsItemType} from "antd/lib/descriptions";

const MovieDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams();
    const {result, getDetails} = useSearchMovieContext();
    const [details, setDetails] = useState<IMovieDetailsData>();
    const [movie, setMovie] = useState<IMovieData>();
    const {token: {colorBgContainer, borderRadiusLG}} = theme.useToken();
    const [isMovieLoading, setMovieLoading] = useState<boolean>(true);
    const [isDetailsLoading, setDetailsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (params.id != null) {
            const findedMovie = result.list.find((movie) => movie.imdbId === params.id);
            if (findedMovie !== null) {
                setMovie(findedMovie);
                setMovieLoading(false);
            }
            getDetails(params.id).then((result: IMovieDetailsData | null) => {
                if (result !== null) {
                    setDetails(result);
                    setMovie(prevState => ({
                        ...prevState,
                        title: result.title,
                        year: result.year,
                        imdbId: result.imdbId,
                        type: result.type,
                        poster: result.poster,
                    }));
                    setMovieLoading(false);
                    setDetailsLoading(false);
                }
            });
        }
    }, [params.id, result.list, getDetails]);

    function transformToDescriptionsItemType(obj?: Record<string, any>, filter: string[] = []): DescriptionsItemType[] {
        if (obj == null) return [];
        return Object.entries(obj)
            .filter(([key, _]) => !filter.includes(key))
            .map(([key, value]) => ({
                key: key,
                label: capitalizeFirstLetter(key),
                children: capitalizeFirstLetter(value)
            }));
    }

    const capitalizeFirstLetter = (str?: string): string => {
        if (!str) return '';
        if (str.length === 0) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const general = transformToDescriptionsItemType(details, ['ratings', 'poster', 'imdbId', 'type', 'year', 'title']);

    const items = transformToDescriptionsItemType(movie, ['imdbId', 'poster', 'title']);


    return (
        <Layout style={{height: "100%"}}>
            {isMovieLoading ?
                <Spin/> :
                <Layout.Content
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        padding: '0 48px',
                    }}
                >
                    <Card
                        title={details?.title ?? movie?.title}
                        size="small"
                        style={{
                            padding: 24,
                            minHeight: 380,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}>
                        <Space align="start" direction="horizontal">
                            <img src={movie?.poster ?? details?.poster} style={{paddingRight: 15}}/>
                            <Space direction="vertical">
                                {items.length > 1 && <Descriptions items={items}/>}
                                {general.length > 0 && <Descriptions items={general}/>}
                            </Space>
                        </Space>
                    </Card>
                </Layout.Content>
            }
            <Layout.Footer
                style={{
                    textAlign: 'center',
                }}
            >
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Layout.Footer>
        </Layout>
    )
        ;
};

export default MovieDetailsPage;