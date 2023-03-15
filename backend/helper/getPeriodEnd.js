function getPeriodEnd(periodType, startDate) {
    const date = new Date(startDate);
    switch(periodType) {
    case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
    case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
    case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
    return date;
  }

module.exports = getPeriodEnd;