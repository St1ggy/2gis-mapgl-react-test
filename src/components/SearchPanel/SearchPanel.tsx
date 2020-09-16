import React, {useState, useCallback} from 'react';
import classNames from 'classnames';
import axios from 'axios';

import './SearchPanel.css';

const getSearchUrl = ({searchQuery, pageSize = 1000, regionId = 32}: { searchQuery: string, pageSize?: number, regionId?: number }) => `https://catalog.api.2gis.ru/3.0/markers?q=${searchQuery}&page_size=${pageSize}&region_id=${regionId}&key=ruhebf8058`;

export const SearchPanel = ({onGetResult}: { onGetResult: Function }) => {
  // state
  const [searchQuery, setSearchQuery] = useState<string>('магазины');
  const [isActive, setIsActive] = useState<boolean>(false);

  // callbacks
  const onFocus = useCallback(() => {
    setIsActive(true);
  }, [])
  const onBlur = useCallback(() => {
    setIsActive(false);
  }, [])
  const onSubmit = useCallback(() => {
    if (searchQuery.length > 0) {
      (async () => {
        const {data: {result: {items}}} = await axios.get(getSearchUrl({
          searchQuery,
        }));
        onGetResult(items.map(({lon, lat}) => ({lon, lat})));
      })();
    } else {
        onGetResult([]);
    }
  }, [onGetResult, searchQuery])


  return (
    <form
      className={classNames('search-panel', {"search-panel-active": isActive})}
      onSubmit={onSubmit}
    >
      <input
        value={searchQuery}
        onChange={({target: {value}}) => setSearchQuery(value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmitCapture={onSubmit}
      />
      <div className='button' onClick={onSubmit}>Поиск</div>
    </form>
  );
};
