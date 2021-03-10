export default function CollectData()
{
    return function(target: Object, key: string |symbol, descriptior: PropertyDescriptor){
        //todo hook array object in a map and update a cache, then have a handler update some database for statistics.
        // 1. get attached data
        // 2. filter the data
        // 3. enque the filterd data in a job queue
        // 4. handler of the jobs perioticly dumps data to a database.
        // 5. collected data cand be fetched from an api.
    };

}
    
