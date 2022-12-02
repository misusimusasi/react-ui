import * as React from 'react';

import type { TableProps, Column } from '#src/components/Table';
import {
  HeaderCell,
  HeaderCellContent,
  HeaderCellTitle,
  HeaderCellSpacer,
  TitleContent,
  SortIconWrapper,
  SortIcon,
  SortOrder,
} from './style';
import { RowWidthResizer } from './RowWidthResizer';
import { Filter } from './filter/Filter';
import { TitleText } from './TitleText';

type HeaderCellI = {
  columnsAmount: number;
  showDividerForLastColumn?: boolean;
  disableColumnResize: boolean;
  index: number;
  dimension?: TableProps['dimension'];
  headerLineClamp: number;
  headerExtraLineClamp: number;
  spacingBetweenItems?: string;
  resizerState: any;
  handleResizeChange: any;
  handleSort: any;
  multipleSort?: boolean;
};

const DEFAULT_COLUMN_WIDTH = 100;

export const HeaderCellComponent = ({
  columnsAmount,
  showDividerForLastColumn,
  disableColumnResize,
  headerLineClamp,
  headerExtraLineClamp,
  spacingBetweenItems,
  dimension,
  name,
  title,
  extraText,
  width = DEFAULT_COLUMN_WIDTH,
  resizerWidth,
  resizerState,
  handleResizeChange,
  handleSort,
  multipleSort,
  cellAlign = 'left',
  sortable = false,
  sort,
  sortOrder,
  disableResize = false,
  renderFilter,
  renderFilterIcon,
  onFilterMenuClickOutside,
  onFilterMenuClose,
  onFilterMenuOpen,
  index,
}: HeaderCellI & Column & { resizerWidth: number }) => {
  const cellRef = React.createRef<HTMLDivElement>();
  const iconSize = dimension === 's' || dimension === 'm' ? 16 : 20;
  const defaultSpacer = dimension === 'l' || dimension === 'xl' ? '16px' : '12px';
  const spacer = spacingBetweenItems || defaultSpacer;

  return (
    <HeaderCell
      key={`head_${name}`}
      dimension={dimension}
      style={{ width: width, minWidth: width }}
      className="th"
      ref={cellRef}
    >
      <HeaderCellContent cellAlign={cellAlign}>
        <HeaderCellTitle
          sort={sort || 'initial'}
          onClick={sortable ? () => handleSort(name, sort || 'initial') : undefined}
        >
          <TitleContent dimension={dimension} sortable={sortable}>
            <TitleText dimension={dimension} lineClamp={headerLineClamp} title={title} />
            {extraText && (
              <TitleText extraText dimension={dimension} lineClamp={headerExtraLineClamp} title={extraText} />
            )}
          </TitleContent>
          {sortable && (
            <SortIconWrapper>
              <SortIcon sort={sort || 'initial'} width={iconSize} height={iconSize} />
              {multipleSort && sort && sortOrder && <SortOrder>{sortOrder}</SortOrder>}
            </SortIconWrapper>
          )}
        </HeaderCellTitle>
        <HeaderCellSpacer width={renderFilter ? spacer : `${parseInt(spacer) - parseInt(defaultSpacer)}px`} />
        {renderFilter && (
          <Filter
            dimension={dimension}
            renderFilter={renderFilter}
            renderFilterIcon={renderFilterIcon}
            onFilterMenuClickOutside={onFilterMenuClickOutside}
            onFilterMenuOpen={onFilterMenuOpen}
            onFilterMenuClose={onFilterMenuClose}
            cellAlign={cellAlign}
            targetRef={cellRef}
          />
        )}
      </HeaderCellContent>
      {index < columnsAmount - 1 && (
        <RowWidthResizer
          name={name}
          width={width ? resizerWidth : DEFAULT_COLUMN_WIDTH}
          onChange={handleResizeChange}
          disabled={disableResize || disableColumnResize}
          resizerState={resizerState}
          dimension={dimension}
        />
      )}
      {index === columnsAmount - 1 && showDividerForLastColumn && (
        <RowWidthResizer
          name={name}
          width={width ? resizerWidth : DEFAULT_COLUMN_WIDTH}
          onChange={handleResizeChange}
          disabled={disableResize || disableColumnResize}
          resizerState={resizerState}
          dimension={dimension}
        />
      )}
    </HeaderCell>
  );
};
