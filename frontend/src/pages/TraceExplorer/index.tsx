import { Card, Col, Row, Tabs } from 'antd';
import { QueryBuilder } from 'container/QueryBuilder';
// import { useQueryBuilder } from 'hooks/queryBuilder/useQueryBuilder';
import React, { useEffect } from 'react';
import { createEnumParam } from 'serialize-query-params';
import { DataSource } from 'types/common/queryBuilder';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

// eslint-disable-next-line sonarjs/no-duplicate-string
const tabs = ['list', 'traces', 'time-series', 'table'] as const;
type Tab = typeof tabs[number];
const TabUrlParam = createEnumParam<Tab>([...tabs]);

function TraceExplorer(): JSX.Element {
	// const { queryBuilderData, initQueryBuilderData } = useQueryBuilder();
	const [tab, setTab] = useQueryParam('tab', withDefault(TabUrlParam, 'list'));

	if (!tab) {
		return null;
	}

	return (
		<Card>
			<Row>
				<Col span={24}>
					<QueryBuilder
						panelType="EMPTY_WIDGET"
						config={{ initialDataSource: DataSource.TRACES, queryVariant: 'static' }}
					/>

					<Tabs
						style={{ marginTop: '4rem' }}
						activeKey={tab}
						onChange={(v): void => setTab(v as Tab)}
						items={[
							{ key: 'list', label: 'List View' },
							{ key: 'traces', label: 'Traces' },
							{ key: 'time-series', label: 'Time Series' },
							{ key: 'table', label: 'Table View' },
						]}
					/>
				</Col>
			</Row>

			<Row>
				<Col span={24}>
					{tab === 'list' && <div>list</div>}
					{tab === 'traces' && <div>traces</div>}
					{tab === 'time-series' && <div>time-series</div>}
					{tab === 'table' && <div>table</div>}
				</Col>
			</Row>
		</Card>
	);
}

export default TraceExplorer;
