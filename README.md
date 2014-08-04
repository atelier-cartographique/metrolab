metrolab
========

Metrolab is a collaborative tool aimed at informing, questionning and building territories.

## plan

As of today, it's planned to implement the following features:

  - user authentication
  - multiple layers per user
  - geometric layers (polygons, lines, points)
  - media layers (texts (possibly rich), images)
  - overlays
  - layer subscription
  - notifications

## basic architecture

An express application. With knex as a SQL query builder, passport for authentication, serving a web application based on backbone and making use of require.

### web frontend

login/logout application

main application is made of a map equipped with editing tools. 
Based on leaflet and its drawing plugin. It must be able to display geometries received in JSON dictionaries.
It might also feature a notification area.

layers management application

### data storage

based on postgis, it must allow to store either geometric data and general types, esp. textual informations.

geometric data might be retrieved at different simplification ratios.



