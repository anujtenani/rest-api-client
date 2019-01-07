# Fundamentals behind dynamic values in requests
## Core principles

1. Every dynamic value is function

Every dynamic value or variable that you add in the request is stored as a function object
which resolves to a defaultValue or function name in case the value is not set

Every variable is stored in a requestMeta array as
{
    fnKey:'thekeydeclared in the request area', //string - must be unique per request
    defaultValue:'value to use, this value is overridden if a variable is already declared in worker local scope during testing',
    fn: 'attached function name', //string (optional) - if not specified the fnKey is called as is
    args:'json.stringfied array or object', //string (optional)
}


2. What happens during a serial test


eg.
Request - Create Data
    Values available - request and response data
Request - Update Data

