import React from 'react';
import {MovieModel} from "models/MovieModel";
import {Card, Col, Row, Image, Pagination} from 'antd';
import Meta from 'antd/es/card/Meta';
import styles from './MoviesList.module.css'
import Layout from 'antd/lib/layout';

const MoviesList: React.FC<{
    isLoading: boolean;
    movies: MovieModel[];
    page: number;
    totalPages: number;
    onItemClick: (id: string) => void
    onPageChange: (page: number) => void
}> = ({isLoading, movies, page, totalPages, onItemClick, onPageChange}) => {
    return (
        <Layout.Content>
            <Row
                className={styles.row}
                gutter={{
                    xs: 8,
                    sm: 16,
                    md: 24,
                    lg: 32,
                }}
            >
                {movies.map((movie) => (
                    <Col
                        key={`col-${movie.imdbId}`}
                        className={styles.col}
                    >
                        <Card
                            key={`card-${movie.imdbId}`}
                            hoverable
                            className={styles.card}
                            cover={<Image src={movie.poster}/>}
                            actions={[
                                <a onClick={() => onItemClick(movie.imdbId)}>
                                    Details
                                </a>
                            ]}
                        >
                            <Meta
                                title={movie.title}
                                description={movie.year}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
            <Pagination
                disabled={isLoading}
                align="center"
                pageSizeOptions={['10']}
                current={page}
                total={totalPages}
                onChange={(page, _) => onPageChange(page)}
            />
        </Layout.Content>
    );
};

export default MoviesList;
