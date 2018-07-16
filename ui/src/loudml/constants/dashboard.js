export const DEFAULT_CONFIDENT_CELL =
    {
        // "i": "a404ef2b-6e22-48d7-bd34-5bfd21ab811b",
        "x": 0,
        "y": 0,
        "w": 12,
        "h": 4,
        // "name": "sin prediction",
        "queries": [
            {
                "query": "SELECT mean(\"lower_sin1\") AS \"mean_lower_sin1\" FROM \"ecommerce\".\"autogen\".\"prediction_sin\" WHERE time > :dashboardTime: GROUP BY time(30m) FILL(null)",
                "queryConfig": {
                    "database": "ecommerce",
                    "measurement": "prediction_sin",
                    "retentionPolicy": "autogen",
                    "fields": [
                        {
                            "value": "mean",
                            "type": "func",
                            "alias": "mean_lower_sin1",
                            "args": [
                                {
                                    "value": "lower_sin1",
                                    "type": "field",
                                    "alias": ""
                                }
                            ]
                        }
                    ],
                    "tags": {},
                    "groupBy": {
                        "time": "30m",
                        "tags": []
                    },
                    "areTagsAccepted": false,
                    "fill": "null",
                    "rawText": null,
                    "range": null,
                    "shifts": null
                },
                // "source": "/chronograf/v1/sources/4"
            },
            {
                "query": "SELECT mean(\"sin1\") AS \"mean_sin1\" FROM \"ecommerce\".\"autogen\".\"prediction_sin\" WHERE time > :dashboardTime: GROUP BY time(30m) FILL(null)",
                "queryConfig": {
                    "database": "ecommerce",
                    "measurement": "prediction_sin",
                    "retentionPolicy": "autogen",
                    "fields": [
                        {
                            "value": "mean",
                            "type": "func",
                            "alias": "mean_sin1",
                            "args": [
                                {
                                    "value": "sin1",
                                    "type": "field",
                                    "alias": ""
                                }
                            ]
                        }
                    ],
                    "tags": {},
                    "groupBy": {
                        "time": "30m",
                        "tags": []
                    },
                    "areTagsAccepted": false,
                    "fill": "null",
                    "rawText": null,
                    "range": null,
                    "shifts": null
                },
                // "source": "/chronograf/v1/sources/4"
            },
            {
                "query": "SELECT mean(\"upper_sin1\") AS \"mean_upper_sin1\" FROM \"ecommerce\".\"autogen\".\"prediction_sin\" WHERE time > :dashboardTime: GROUP BY time(30m) FILL(null)",
                "queryConfig": {
                    "database": "ecommerce",
                    "measurement": "prediction_sin",
                    "retentionPolicy": "autogen",
                    "fields": [
                        {
                            "value": "mean",
                            "type": "func",
                            "alias": "mean_upper_sin1",
                            "args": [
                                {
                                    "value": "upper_sin1",
                                    "type": "field",
                                    "alias": ""
                                }
                            ]
                        }
                    ],
                    "tags": {},
                    "groupBy": {
                        "time": "30m",
                        "tags": []
                    },
                    "areTagsAccepted": false,
                    "fill": "null",
                    "rawText": null,
                    "range": null,
                    "shifts": null
                },
                "source": "/chronograf/v1/sources/4"
            }
        ],
        "axes": {
            "x": {
                "bounds": [
                    "",
                    ""
                ],
                "label": "",
                "prefix": "",
                "suffix": "",
                "base": "10",
                "scale": "linear"
            },
            "y": {
                "bounds": [
                    "",
                    ""
                ],
                "label": "",
                "prefix": "",
                "suffix": "",
                "base": "10",
                "scale": "linear"
            },
            "y2": {
                "bounds": [
                    "",
                    ""
                ],
                "label": "",
                "prefix": "",
                "suffix": "",
                "base": "10",
                "scale": "linear"
            }
        },
        "type": "line",
        "colors": [],
        "legend": {},
        "tableOptions": {
            "timeFormat": "MM/DD/YYYY HH:mm:ss.SS",
            "verticalTimeAxis": true,
            "sortBy": {
                "internalName": "time",
                "displayName": "",
                "visible": true
            },
            "wrapping": "truncate",
            "fieldNames": [
                {
                    "internalName": "time",
                    "displayName": "",
                    "visible": true
                }
            ],
            "fixFirstColumn": true
        },
        // "links": {
        //     "self": "/chronograf/v1/dashboards/4/cells/a404ef2b-6e22-48d7-bd34-5bfd21ab811b"
        // }
    }

export const DEFAULT_CONFIDENT_DASHBOARD = 
{
    // "id": 4,
    "cells": [],
    "templates": [],
    // "name": "sin",
    "organization": "default",
    "links": {
        "self": "/chronograf/v1/dashboards/4",
        "cells": "/chronograf/v1/dashboards/4/cells",
    }
}