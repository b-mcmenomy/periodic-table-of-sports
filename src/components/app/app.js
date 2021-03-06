import React, { useState, useEffect } from 'react';

import { PrimaryGroup, SecondaryGroup } from '../card-container/card-container';
import InfoMenu from '../info-menu/info-menu';
import InteractionMenu from '../interaction-menu/interaction-menu';
import Legend from '../legend/legend';

import './app.styles.css';
// import * as newData from '../../data/data.json';
import enums from '../../data/enums';

const App = () => {
  const [data, setData] = useState([]);
  const [cards, setCards] = useState([]);
  const [clicked, setClick] = useState({ clicked: false, keyword: [], data: {} });
  const [sort, setSort] = useState(enums.type);
  const [categoryGroupToggle, setCategoryGroupToggle] = useState(true);
  // const [filter, setFilter] = useState({ clicked: false, filter: "" });
  const [filter, setFilter] = useState({
    [enums.professional]: false,
    [enums.olympic]: false,
    [enums.paralympic]: false,
    [enums.college]: false,
    [enums.youth]: false,
    [enums.team]: false,
    [enums.pool]: false,
    [enums.openWater]: false,
    [enums.indoor]: false,
    [enums.outdoor]: false,
    [enums.digital]: false,
    [enums.winterSport]: false,
    [enums.eSport]: false,
    [enums.racing]: false,
    [enums.crowdSize]: false,
    [enums.intensity]: false,
  });
  
  useEffect(() => {
    const fetchSpreadSheetData = async () => {
      const resp = await fetch(`${process.env.REACT_APP_SPREADSHEET_LINK}`);
      const res = await resp.json();

      let fetchedData = res.values;
      const keys = res.values.shift(); // remove first row as it is an array of column headers
      // TODO use these headers to create filters and sort buttons programatically?
      fetchedData = fetchedData.map((row) => {
        const rowData = {};
        row.forEach((item, i) => {
          rowData[keys[i]] = item;
        })
        return rowData;
      })
      setData(fetchedData);
    }
    fetchSpreadSheetData();
  }, []);

  useEffect(() => {
    const intensitySorted = data.sort(intensitySort);

    const primaryGrouped = groupBy(intensitySorted, sort);
    const categoryGrouped = groupBy(intensitySorted, enums.categorySort);
    const secondaryGrouped = Object.values(categoryGrouped).map((colorGroup) => groupBy(colorGroup, sort));

    const cardArray = categoryGroupToggle 
      ? Object.values(secondaryGrouped)
        .map((primaryGroups, i) => <PrimaryGroup 
          key={`cards${i}`}
          primaryGroups={primaryGroups}
          setClick={setClick}
          clicked={clicked}
          filter={filter}
          sort={sort}
        />)
      : Object.values(primaryGrouped)
        .map((secondaryGroups, i) => <SecondaryGroup 
          key={`cards${i}`}
          secondaryGroups={secondaryGroups}
          setClick={setClick}
          clicked={clicked}
          filter={filter}
          sort={sort}
        />)
    setCards(cardArray);
  }, [data, clicked, categoryGroupToggle, filter, sort]);

  /**
   * Helper function to group elements in an array by a given key
   */
  const groupBy = (array, key) => {
    return array.reduce((acc, curr) => {
      (acc[curr[key]] = acc[curr[key]] || []).push(curr);
      return acc;
    }, {});
  }
  /**
   * Helper function to sort by intensity from low to high
   */
  const intensitySort = (a, b) => {
    const aIntensity = parseInt(a[enums.intensity]);
    const bIntensity = parseInt(b[enums.intensity]);
    return (aIntensity - bIntensity);
  }

  return (
    <div className="AppContainer">
      <div className="App">
        <InteractionMenu
          cards={cards}
          setCards={setCards}
          filter={filter} 
          setFilter={setFilter} 
          sort={sort}
          setSort={setSort}
          categoryGroupToggle={categoryGroupToggle}
          setCategoryGroupToggle={setCategoryGroupToggle} />
        <div className='CardContainer'>
          <Legend 
            filter={filter}
            setFilter={setFilter}
            categoryGroupToggle={categoryGroupToggle}
            setCategoryGroupToggle={setCategoryGroupToggle} />
          {cards}
          {clicked.clicked && <InfoMenu setClick={setClick} clicked={clicked} />}
        </div>
      </div>
    </div>
  );
}

export default App;
