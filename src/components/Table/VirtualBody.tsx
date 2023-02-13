import * as React from 'react';
import styled from 'styled-components';
import { refSetter } from '#src/components/common/utils/refSetter';

import { ScrollTableBody } from './style';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow: hidden;
`;

const Spacer = styled.div`
  display: flex;
  flex: 0 0 auto;
  position: relative;
`;

const PreloadZone = styled.div`
  position: absolute;
  bottom: 0;
  visibility: hidden;
  width: 100%;
`;

interface VirtualBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  height: number;
  childHeight: number;
  renderAhread?: number;
  rowList: any[];
  renderRow: (row: any, index: number) => React.ReactNode;
  loadMoreRows?: () => void;
}

export const VirtualBody = React.forwardRef<HTMLDivElement, VirtualBodyProps>(
  ({ height, childHeight, renderAhread = 10, rowList, renderRow, loadMoreRows, ...props }, ref) => {
    const [scrollTop, setScrollTop] = React.useState(0);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const preloadRef = React.useRef<HTMLDivElement>(null);

    const handleScroll = (e: any) => {
      requestAnimationFrame(() => {
        setScrollTop(e.target.scrollTop);
      });
    };

    React.useEffect(() => {
      const scrollContainer = scrollContainerRef.current;
      setScrollTop(scrollContainer?.scrollTop || 0);

      scrollContainer?.addEventListener('scroll', handleScroll);
      return () => scrollContainer?.removeEventListener('scroll', handleScroll);
    }, []);

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.0) {
          loadMoreRows?.();
        }
      });
    };

    React.useLayoutEffect(() => {
      const observer = new IntersectionObserver(handleIntersection, {
        root: wrapperRef.current,
        threshold: [0, 0.1, 1.0],
      });
      if (preloadRef.current) {
        observer.observe(preloadRef.current);
      }
      return () => observer.disconnect();
    }, [wrapperRef.current, preloadRef.current]);

    let startNode = Math.floor(scrollTop / childHeight) - renderAhread;
    startNode = Math.max(0, startNode);

    const rowNodes = React.useMemo(
      () => rowList.map((row, index) => renderRow(row, index)).filter(Boolean),
      [rowList, renderRow],
    );
    const itemCount = rowNodes.length;

    let visibleNodeCount = Math.ceil(height / childHeight) + 2 * renderAhread;
    visibleNodeCount = Math.min(itemCount - startNode, visibleNodeCount);

    const topPadding = `${startNode * childHeight}px`;
    const bottomPadding = `${(itemCount - startNode - visibleNodeCount) * childHeight}px`;

    const visibleChildren = React.useMemo(
      () => [...rowNodes].slice(startNode, startNode + visibleNodeCount),
      [rowNodes, startNode, visibleNodeCount],
    );

    return (
      <Wrapper ref={refSetter(ref, wrapperRef)}>
        <ScrollTableBody style={{ height }} ref={scrollContainerRef} {...props}>
          <Spacer style={{ minHeight: topPadding }} />
          {visibleChildren}
          <Spacer style={{ minHeight: bottomPadding }}>
            <PreloadZone ref={preloadRef} style={{ minHeight: childHeight * renderAhread + 'px' }} />
          </Spacer>
        </ScrollTableBody>
      </Wrapper>
    );
  },
);
