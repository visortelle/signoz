/* eslint-disable  */
// TODO: fix it after merge actual functionality
// @ts-nocheck
import { Query } from 'types/api/dashboard/getAll';

import {
	WIDGET_QUERY_BUILDER_FORMULA_KEY_NAME,
	WIDGET_QUERY_BUILDER_QUERY_KEY_NAME,
} from '../../constants';

const QUERY_AND_FORMULA_LIMIT = 10;

export const canCreateQueryAndFormula = (query: Query): boolean => {
	const queries = query[WIDGET_QUERY_BUILDER_QUERY_KEY_NAME].queryBuilder;
	const formulas =
		query[WIDGET_QUERY_BUILDER_QUERY_KEY_NAME][
			WIDGET_QUERY_BUILDER_FORMULA_KEY_NAME
		];

	return queries.length + formulas.length < QUERY_AND_FORMULA_LIMIT;
};
