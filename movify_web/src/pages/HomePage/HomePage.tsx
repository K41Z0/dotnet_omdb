import React, {useState} from 'react';
import {AutoComplete, DatePicker, Input, Select, Space, Layout, Image, Modal, Pagination, Switch} from 'antd';
import {useSearchMovieContext} from 'context/SearchMovieContext';
import styles from './HomePage.module.css'
import welcomeImage from 'assets/welcome_logo.png';
import MoviesList from 'components/MoviesList/MoviesList';
import {DataSourceItemObject} from 'antd/lib/auto-complete';
import {useNavigate} from "react-router-dom";

const HomePage: React.FC = () => {
    const {result, searchBy, changePage} = useSearchMovieContext();
    const [year, setYear] = useState<string>('');
    const [type, setType] = useState<string>('');
    const navigate = useNavigate();

    const searchTypeOptions = [
        {
            value: 'all',
            label: 'All',
        },
        {
            value: 'movie',
            label: 'Movie',
        },
        {
            value: 'series',
            label: 'Series',
        },
        {
            value: 'episode',
            label: 'Episode',
        },
    ];

    const autoCompleteOptions: DataSourceItemObject[] = Array.from(result.inputHistory).map(([key, value]) => ({
        text: value.toString(),
        value: key,
    }));

    const handleSearch = async (value: string): Promise<void> => {
        await searchBy({
            input: value,
            year,
            type,
        });
    }

    const handleSelectDate = (dateString: string | string[]): void => {
        if (typeof dateString === "string") {
            setYear(dateString);
        }
    }

    const handleSelectType = (value: string): void => {
        setType(value);
    }

    const handlePageChange = async (page: number): Promise<void> => {
        changePage(page);
    }

    return (
        <Layout.Content className={styles.content}>
            <Image
                width={200}
                src={welcomeImage}
                alt="My Image"
                preview={false}
            />
            <Space
                className={styles.inputContainer}
                direction="horizontal"
                align="center"
            >
                <Select
                    className={styles.inputType}
                    defaultValue="all"
                    onChange={handleSelectType}
                    options={searchTypeOptions}
                />
                <DatePicker
                    onChange={(_, dateString: string | string[]) => handleSelectDate(dateString)}
                    placeholder='Year'
                    picker="year"
                />
                <AutoComplete
                    onSelect={handleSearch}
                    options={autoCompleteOptions}
                    filterOption={(inputValue: string, option: any) =>
                        option.value
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                    }
                >
                    <Input.Search
                        placeholder="input search text"
                        allowClear
                        enterButton="Search"
                        loading={result.isLoading}
                        onSearch={async (value, _, info) => {
                            if (info?.source === 'input') {
                                await handleSearch(value);
                            }
                        }}
                    />
                </AutoComplete>
            </Space>
            {result.list.length > 0 &&
                <div style={{paddingBottom: 20}}>
                    <MoviesList
                        isLoading={result.isLoading}
                        movies={result.list}
                        page={result.page}
                        totalPages={result.totalPages}
                        onItemClick={
                            function (id: string): void {
                                navigate(`/details/${id}`);
                            }}
                        onPageChange={handlePageChange}
                    />
                </div>}
        </Layout.Content>
    );
};

export default HomePage;