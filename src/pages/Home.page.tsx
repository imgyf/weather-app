import { useState } from 'react';
import { ActionIcon, Alert, Box, Container, Grid, Text, TextInput, Card, Group } from '@mantine/core';
import { IconInfoCircle, IconSearch, IconTrashFilled } from '@tabler/icons-react';
import classes from './Home.page.module.css';

const OPEN_WEATHER_API_KEY = '';

export function HomePage() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [searchHistory, setSearchHistory] = useState<{
    city: string;
    country: string;
    timestamp: string;
  }[]>([]);

  const handleSearch = async (searchHistoryCity:string | null = null) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchHistoryCity ?? city}&units=metric&appid=${OPEN_WEATHER_API_KEY}`);
      const data = await response.json();
      setWeatherData(data);
      if (data?.cod !== '404') {
        const existingIndex = searchHistory.findIndex((item) => item.city === data.name);
        if (existingIndex !== -1) {
          const updatedHistory = [
            searchHistory[existingIndex],
            ...searchHistory.slice(0, existingIndex),
            ...searchHistory.slice(existingIndex + 1),
          ];
          updatedHistory[0].timestamp = new Date().toLocaleString('en-US');
          setSearchHistory(updatedHistory);
        } else {
          setSearchHistory([{ city: data.name, country: data.sys.country, timestamp: new Date().toLocaleString('en-US') }, ...searchHistory]);
        }
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
    }
  };

  return (
    <Container mt="xl" size="sm">
      <Grid mt="xl">
        <Grid.Col span={11}>
          <TextInput
            size="md"
            value={city}
            radius="lg"
            onChange={(event) => setCity(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSearch();
              }
            }}
            classNames={{
              input: classes.input,
            }}
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <ActionIcon size="xl" radius={16} variant="filled" color="#6C40B5" aria-label="Settings" onClick={() => handleSearch()}>
            <IconSearch style={{ width: '60%', height: '60%' }} stroke={2} />
          </ActionIcon>
        </Grid.Col>
      </Grid>
      <Card
        padding="xl"
        radius="xl"
        mt="xl"
        withBorder
        classNames={{
          root: classes.mainCard,
        }}
      >
        <Box
          mb="md"
          style={{
            borderBottom: '1px solid #FFFFFF80',
          }}
        >
          <Text fw={500}>Today&apos;s Weather</Text>
        </Box>
        {weatherData && weatherData?.cod !== '404' && (
          <>
            <Text fw={700} size="60px" c="#6C40B5">{Math.round(weatherData.main.temp)} °C</Text>
            <Text>
              H: {
              Math.round(weatherData.main.temp_max)
              } °C
              L: {
                Math.round(weatherData.main.temp_min)
              } °C
            </Text>
            <Group justify="space-between" mb="xs">
              <Text fw={600} size="sm" c="#666666">
                {`${weatherData.name}, ${weatherData.sys.country}`}
              </Text>
              <Text size="sm" c="#666666">
                  {new Date().toLocaleString('en-US')}
              </Text>
              <Text size="sm" c="#666666">
                Humidity: {weatherData.main.humidity}%
              </Text>
              <Text size="sm" c="#666666">
                {weatherData.weather[0].main}
              </Text>
            </Group>
          </>
        )}
        {weatherData?.cod === '404' && (
          <Alert variant="light" color="red" title="City not found. Please try again." icon={<IconInfoCircle />} />
        )}
        {weatherData === null && (
          <Alert variant="light" color="blue" title="Please enter a city to search for above." icon={<IconInfoCircle />} />
        )}

        {searchHistory.length > 0 && (
          <Card
            padding="lg"
            radius="lg"
            mt="sm"
            classNames={{
            root: classes.searchHistoryCard,
          }}
          >
          <Text fw={400} mb="md">Search History</Text>
          {searchHistory.map((item) => (
            <Group
              p="sm"
              bg="#FFFFFF66"
              key={item.timestamp}
              justify="space-between"
              mb="xs"
              style={{
              borderRadius: '16px',
            }}
            >
              <Text fw={400} size="sm" c="#000000">
                {`${item.city}, ${item.country}`}
              </Text>
              <Group>
                <Text size="sm" c="#000000">
                {item.timestamp}
                </Text>
                <ActionIcon
                  variant="filled"
                  color="white"
                  radius="lg"
                  aria-label="Search"
                >
                  <IconSearch
                    style={{ width: '60%', height: '60%', color: 'gray' }}
                    stroke={1.5}
                    onClick={() => handleSearch(item.city)}
                  />
                </ActionIcon>
                <ActionIcon
                  variant="filled"
                  color="white"
                  radius="lg"
                  aria-label="Delete"
                  onClick={() => {
                    setSearchHistory(searchHistory.filter((sh) => sh.city !== item.city));
                  }}
                >
                  <IconTrashFilled style={{ width: '60%', height: '60%', color: 'gray' }} stroke={1.5} />
                </ActionIcon>
              </Group>
            </Group>
          ))}
          </Card>
        )}
      </Card>
    </Container>
  );
}
