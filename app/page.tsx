'use client';
import { useEffect, useState } from 'react';
import { CustomFilter, SearchBar, ShowMore } from '@/components';
import Hero from '@/components/Hero';
import { fetchCars } from '@/utils';
import { CarCard } from '@/components';
import { yearsOfProduction } from '@/constants';
import { fuels } from '@/constants';
import Image from 'next/image';

export default function Home() {
  const [allcars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2022);
  const [fuel, setFuel] = useState('');
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const getCars = async () => {
      setLoading(true);
      try {
        const result = await fetchCars({
          manufacturer: manufacturer || '',
          model: model || '',
          year: year || 2022,
          fuel: fuel || '',
          limit: limit || 10,
        });
        setAllCars(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getCars();
  }, [fuel, year, manufacturer, model, limit]);
  const isDataEmpty = !Array.isArray(allcars) || allcars.length < 1 || !allcars;
  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore the cars you might like</p>
        </div>
        <div className="home__filters">
          <SearchBar setManufacturer={setManufacturer} setModel={setModel} />
          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} setFilter={setFuel} />
            <CustomFilter
              title="year"
              options={yearsOfProduction}
              setFilter={setYear}
            />
          </div>
        </div>
        {allcars.length > 0 ? (
          <section>
            <div className="home__cars-wrapper">
              {allcars?.map((car) => (
                <CarCard car={car} key={car.city_mpg} />
              ))}
            </div>
            {loading && (
              <div className="mt-16 w-full flex-center">
                <Image src="/loader.svg" alt="loader" width={50} height={50} />
              </div>
            )}
            <ShowMore
              pageNumber={limit / 10}
              isNext={limit > allcars.length}
              setLimit={setLimit}
            />
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">Oops, no results</h2>
            <p>{allcars?.message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
