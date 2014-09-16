notes
=====



# virtual mount points mapping

It aims at solving 2 issues. 
Firstly to implement permissions at each level of a path, hence freeing further components of taking care of access rights.
e.g. if /user/foo is restricted, then /user/foo/resource/bar is restricted as well even though bar knows nothing about permissions.

Secondly allowing for huge factorization, and here it becomes smooth to the mind. The pattern being as follow.

a) for a resource /X, a query x is produced, and possibly cached.

b) for a resource /X/Y, a query y is piped to x, and possibly cached yeah!

c) and so on.


Another path to explore might be to insert those pipes in the HTTP handler itself (in the case of expressjs by creting routes and matching forged callebacks) when a new resource is created.


## metrolab/waend use case

reorder resources paths
features are accessed through layers which are pointed by maps. Thus, ACLs are implemented at the map level.

features are accessed by layers which are pointed by a user. Thus another set of ACLs is implemented at the user level, we see here that it overlaps the authentication system, job done!

for what I can understand, we can imagine to just implement ACLs at the map level and all operations would then be covered. Basically a public bit and list of granted user.






