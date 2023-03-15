function getDateFormat(date) {
    const [dd, mm, yyyy] = date.split('-');
    return new Date(`${yyyy}-${mm}-${dd}`);
  }

module.exports = getDateFormat;