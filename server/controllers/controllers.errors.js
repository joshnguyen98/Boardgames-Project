const handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err)
    }
}

const handlePsqlErrors = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad Request." })
    } else if (err.code === "23503") {
        res.status(404).send({ msg: "Not Found." })
    } else if (err.code === "23502") {
        res.status(400).send({ msg: "Bad Request." })
    } else {
        next(err)
    }
}

const handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error."})
}

module.exports = { handleCustomErrors, handlePsqlErrors, handleServerErrors}


