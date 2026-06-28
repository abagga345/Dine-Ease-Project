import client from 'prom-client';

// COUNTERS IN PROMETHEUS
// ONLY INCREASES

const requestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'statusCode', 'route'],
});

export function requestCount(req,res,next){
    // res has an event listener for 'finish' that is called when the response has been sent
    const method= req.method;
    
    res.on('finish', () => {
        const route = req.route ? req.route.path : req.path || 'unknown';
        const statusCode = res.statusCode;
        requestCounter.inc({ method, statusCode, route });
    })
    next();
}

//GAUGES IN PROMETHEUS
// CAN GO UP AND DOWN

const requestGauge = new client.Gauge({
    name: 'http_active_requests',
    help: 'Number of active HTTP requests',
    labelNames: ['method', 'route'],
});

export function activeRequestCount(req, res, next) {
    const method = req.method;
    const route = req.route ? req.route.path : req.path || 'unknown';
    
    requestGauge.inc({ method, route });
    res.on('finish', () => {
        requestGauge.dec({ method, route });
    });

    next();
}

// HISTOGRAMS IN PROMETHEUS
// TIME TAKEN FOR REQUESTS

const requestDurationHistogram = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'statusCode', 'route'],
    buckets: [0.1, 0.5, 1, 2.5, 5, 10,100], // Buckets for response time in seconds
});

export function requestDuration(req, res, next) {
    const start = Date.now();
    const method = req.method;
    
    res.on('finish', () => {
        const route = req.route ? req.route.path : req.path || 'unknown';
        const duration = (Date.now() - start) / 1000; // Convert to seconds
        const statusCode = res.statusCode;
        requestDurationHistogram.observe({ method, statusCode, route }, duration);
    });

    next();
}