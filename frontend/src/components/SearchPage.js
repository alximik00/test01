import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchListings } from '../store/listingsSlice';
import api from '../services/api';

// Helper function to get next week's Monday and Sunday dates
const getNextWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysUntilNextMonday = currentDay === 0 ? 1 : 8 - currentDay; // Days until next Monday
  
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilNextMonday);
  
  const nextSunday = new Date(nextMonday);
  nextSunday.setDate(nextMonday.getDate() + 6); // 6 days after Monday = Sunday
  
  // Format as YYYY-MM-DD for date input
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  return {
    checkIn: formatDate(nextMonday),
    checkOut: formatDate(nextSunday),
  };
};

const SearchPage = () => {
  const dispatch = useDispatch();
  const { listings, loading, error, pagination } = useSelector(
    (state) => state.listings
  );
  const safeListings = Array.isArray(listings) ? listings : [];

  const locationFieldRef = useRef(null);

  const nextWeekDates = getNextWeekDates();
  const [city, setCity] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [checkIn, setCheckIn] = useState(nextWeekDates.checkIn);
  const [checkOut, setCheckOut] = useState(nextWeekDates.checkOut);
  const [selectedListing, setSelectedListing] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city || !checkIn || !checkOut) {
      console.log('Missing required fields');
      console.log('city:', city);
      console.log('checkIn:', checkIn);
      console.log('checkOut:', checkOut);
      return;
    }
    dispatch(searchListings({ city, checkIn, checkOut }));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      const q = city.trim();
      if (q.length < 2) {
        setCitySuggestions([]);
        return;
      }

      api
        .get('/cities', { params: { q } })
        .then((res) => {
          setCitySuggestions(res.data || []);
          setShowSuggestions(true);
        })
        .catch(() => {
          setCitySuggestions([]);
        });
    }, 250);

    return () => clearTimeout(handler);
  }, [city]);

  // Hide suggestions when clicking outside the location field
  useEffect(() => {
    if (!showSuggestions) return;

    const handleClickOutside = (event) => {
      if (
        locationFieldRef.current &&
        !locationFieldRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  const handleSelectCity = (name) => {
    setCity(name);
    setShowSuggestions(false);
  };

  const isFormValid = city.trim() && checkIn && checkOut;

  const currentPage = pagination?.page || 1;
  const perPage = pagination?.perPage || pagination?.per_page || 0;
  const totalCount = pagination?.count || 0;
  const totalPages =
    perPage && totalCount ? Math.ceil(totalCount / perPage) : currentPage;

  const handlePageChange = (newPage) => {
    if (!isFormValid || newPage < 1 || newPage === currentPage) return;
    dispatch(searchListings({ city, checkIn, checkOut, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Find your next apartment stay</h1>
        <p style={styles.subtitle}>
          Search Boom listings by city and reservation dates.
        </p>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formRow}>
            <div style={styles.field} ref={locationFieldRef}>
              <label style={styles.label}>Location (City)</label>
              <input
                type="text"
                placeholder="e.g. Berlin"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setShowSuggestions(false);
                  }
                }}
                style={styles.input}
              />
              {showSuggestions && citySuggestions.length > 0 && (
                <div style={styles.suggestions}>
                  {citySuggestions.map((c) => (
                    <div
                      key={c.id}
                      style={styles.suggestionItem}
                      onMouseDown={() => handleSelectCity(c.name)}
                    >
                      {c.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.formActions}>
            <button
              type="submit"
              style={{
                ...styles.searchButton,
                ...(!isFormValid && styles.searchButtonDisabled),
              }}
              disabled={loading || !isFormValid}
            >
              {loading ? 'Searching…' : 'Search'}
            </button>
          </div>
        </form>

        {error && <div style={styles.error}>{error}</div>}
      </div>

      <div style={styles.resultsSection}>
        {selectedListing ? (
          // Show detail view when a listing is selected
          <div style={styles.detailPanel}>
            <div style={styles.detailHeader}>
              <button
                type="button"
                style={styles.backButton}
                onClick={() => setSelectedListing(null)}
              >
                ← Back
              </button>
              <h2 style={styles.detailTitle}>
                {selectedListing.title ||
                  selectedListing.nickname ||
                  'Listing details'}
              </h2>
            </div>
            {selectedListing.picture && (
              <div style={styles.detailImageWrapper}>
                <img
                  src={selectedListing.picture}
                  alt={
                    selectedListing.title ||
                    selectedListing.nickname ||
                    'Listing photo'
                  }
                  style={styles.detailImage}
                />
              </div>
            )}
            <div style={styles.detailBody}>
              <p style={styles.detailMeta}>
                {selectedListing.city_name && (
                  <span>{selectedListing.city_name}</span>
                )}
                {(selectedListing.beds || selectedListing.baths) && (
                  <span>
                    {selectedListing.city_name && ' · '}
                    {selectedListing.beds &&
                      `${selectedListing.beds} beds`}
                    {selectedListing.beds && selectedListing.baths && ' · '}
                    {selectedListing.baths &&
                      `${selectedListing.baths} baths`}
                  </span>
                )}
                {selectedListing.accommodates && (
                  <span>
                    {' · '}Sleeps {selectedListing.accommodates}
                  </span>
                )}
              </p>

              {selectedListing.extra_info?.current_price && (
                <div style={styles.detailPriceBox}>
                  <div style={styles.detailPriceMain}>
                    <span style={styles.detailPriceLabel}>Total price</span>
                    <span style={styles.detailPriceValue}>
                      $
                      {selectedListing.extra_info.current_price.total_price.toFixed(
                        2
                      )}
                    </span>
                  </div>
                  <p style={styles.detailPriceSub}>
                    Includes cleaning fee $
                    {selectedListing.extra_info.current_price.cleaning_fee.toFixed(
                      2
                    )}{' '}
                    and taxes $
                    {selectedListing.extra_info.current_price.taxes.toFixed(2)}
                  </p>
                </div>
              )}

              {selectedListing.extra_info?.checkin_instructions && (
                <div style={styles.detailSection}>
                  <h3 style={styles.detailSectionTitle}>
                    Check-in instructions
                  </h3>
                  <p style={styles.detailSectionText}>
                    {selectedListing.extra_info.checkin_instructions}
                  </p>
                </div>
              )}

              {selectedListing.extra_info?.contact_email && (
                <div style={styles.detailSection}>
                  <h3 style={styles.detailSectionTitle}>Host contact</h3>
                  <p style={styles.detailSectionText}>
                    {selectedListing.extra_info.contact_name && (
                      <>
                        {selectedListing.extra_info.contact_name}
                        <br />
                      </>
                    )}
                    {selectedListing.extra_info.contact_email}
                    {selectedListing.extra_info.contact_phone && (
                      <>
                        <br />
                        {selectedListing.extra_info.contact_phone}
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>

            <div style={styles.detailFooter}>
              <button
                type="button"
                style={styles.bookNowButton}
                onClick={() => {
                  // Placeholder for future booking flow
                  // eslint-disable-next-line no-console
                  console.log('Book now clicked for listing', selectedListing);
                }}
              >
                Book now
              </button>
            </div>
          </div>
        ) : (
          // Show list view when no listing is selected
          <>
            {loading && safeListings.length === 0 && (
              <div style={styles.loading}>Loading listings…</div>
            )}

            {!loading && safeListings.length === 0 && (
              <div style={styles.empty}>No listings yet. Try searching above.</div>
            )}

            <div style={styles.grid}>
              {safeListings.map((listing) => (
                <div
                  key={listing.id || listing.listing_id}
                  style={styles.card}
                  onClick={() => setSelectedListing(listing)}
                >
                  {listing.picture && (
                    <div style={styles.cardImageWrapper}>
                      <img
                        src={listing.picture}
                        alt={listing.title || listing.nickname || 'Listing photo'}
                        style={styles.cardImage}
                      />
                    </div>
                  )}
                  <h3 style={styles.cardTitle}>
                    {listing.title || listing.nickname || 'Listing'}
                  </h3>

                  {(listing.city_name || listing.beds || listing.baths) && (
                    <p style={styles.cardMeta}>
                      {listing.city_name && <span>{listing.city_name}</span>}
                      {(listing.beds || listing.baths) && (
                        <span>
                          {listing.city_name && ' · '}
                          {listing.beds && `${listing.beds} beds`}
                          {listing.beds && listing.baths && ' · '}
                          {listing.baths && `${listing.baths} baths`}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  type="button"
                  style={{
                    ...styles.pageButton,
                    ...(currentPage === 1 && styles.pageButtonDisabled),
                  }}
                  disabled={currentPage === 1 || loading}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
                <span style={styles.pageInfo}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  style={{
                    ...styles.pageButton,
                    ...(currentPage === totalPages && styles.pageButtonDisabled),
                  }}
                  disabled={currentPage === totalPages || loading}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4ecf7 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  hero: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '3rem 1.5rem 1.5rem',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
    color: '#1f2933',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#52606d',
    marginBottom: '2rem',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.2fr 1.2fr',
    gap: '0.75rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  label: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#9fb3c8',
    marginBottom: '0.25rem',
  },
  input: {
    borderRadius: '999px',
    border: '1px solid #cbd2d9',
    padding: '0.6rem 0.9rem',
    fontSize: '0.95rem',
    outline: 'none',
  },
  suggestions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: '0 0 12px 12px',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.12)',
    maxHeight: '220px',
    overflowY: 'auto',
    zIndex: 10,
  },
  suggestionItem: {
    padding: '0.5rem 0.9rem',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchButton: {
    alignSelf: 'flex-start',
    marginLeft: '0.25rem',
    marginTop: '0.25rem',
    borderRadius: '999px',
    border: 'none',
    padding: '0.7rem 1.6rem',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(37, 99, 235, 0.35)',
  },
  searchButtonDisabled: {
    backgroundColor: '#cbd2d9',
    color: '#9fb3c8',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  resultsSection: {
    maxWidth: '1120px',
    margin: '0 auto',
    padding: '1rem 1.5rem 3rem',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#52606d',
  },
  empty: {
    textAlign: 'center',
    padding: '2rem',
    color: '#9fb3c8',
  },
  grid: {
    marginTop: '1.5rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '1rem',
    padding: '1.25rem',
    boxShadow: '0 12px 25px rgba(15, 23, 42, 0.08)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardImageWrapper: {
    borderRadius: '0.9rem',
    overflow: 'hidden',
    marginBottom: '0.75rem',
  },
  cardImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    display: 'block',
  },
  cardTitle: {
    margin: 0,
    marginBottom: '0.25rem',
    fontSize: '1.1rem',
    color: '#1f2933',
  },
  cardMeta: {
    margin: 0,
    marginBottom: '0.25rem',
    fontSize: '0.9rem',
    color: '#7b8794',
  },
  cardPrice: {
    margin: 0,
    marginBottom: '0.5rem',
    fontWeight: 600,
    color: '#2563eb',
  },
  cardDescription: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#52606d',
  },
  pagination: {
    marginTop: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
  },
  pageButton: {
    borderRadius: '999px',
    border: '1px solid #cbd2d9',
    padding: '0.4rem 1rem',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  pageButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  pageInfo: {
    fontSize: '0.9rem',
    color: '#52606d',
  },
  detailPanel: {
    marginTop: '2rem',
    backgroundColor: '#fff',
    borderRadius: '1rem',
    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.15)',
    overflow: 'hidden',
    textAlign: 'left',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #e4e7eb',
    gap: '1rem',
  },
  detailTitle: {
    margin: 0,
    fontSize: '1.3rem',
    color: '#1f2933',
    textAlign: 'left',
    flex: 1,
  },
  backButton: {
    border: 'none',
    background: 'transparent',
    fontSize: '0.95rem',
    cursor: 'pointer',
    color: '#2563eb',
    fontWeight: 500,
    padding: '0.25rem 0.5rem',
    borderRadius: '0.5rem',
    transition: 'background-color 0.2s',
  },
  detailImageWrapper: {
    width: '100%',
    maxHeight: '320px',
    overflow: 'hidden',
  },
  detailImage: {
    width: '100%',
    height: '320px',
    objectFit: 'cover',
    display: 'block',
  },
  detailBody: {
    padding: '1.25rem',
    textAlign: 'left',
    maxWidth: '100%',
  },
  detailMeta: {
    margin: 0,
    marginBottom: '0.75rem',
    fontSize: '0.95rem',
    color: '#7b8794',
    textAlign: 'left',
  },
  detailPriceBox: {
    borderRadius: '0.75rem',
    backgroundColor: '#eff3ff',
    padding: '0.9rem 1rem',
    marginBottom: '1rem',
    textAlign: 'left',
  },
  detailPriceMain: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  detailPriceLabel: {
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#52606d',
  },
  detailPriceValue: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#2563eb',
  },
  detailPriceSub: {
    margin: 0,
    marginTop: '0.35rem',
    fontSize: '0.85rem',
    color: '#52606d',
    textAlign: 'left',
  },
  detailSection: {
    marginTop: '0.75rem',
    textAlign: 'left',
  },
  detailSectionTitle: {
    margin: 0,
    marginBottom: '0.35rem',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#1f2933',
    textAlign: 'left',
  },
  detailSectionText: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#52606d',
    whiteSpace: 'pre-wrap',
    textAlign: 'left',
  },
  detailFooter: {
    padding: '1rem 1.25rem 1.25rem',
    borderTop: '1px solid #e4e7eb',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  bookNowButton: {
    borderRadius: '999px',
    border: 'none',
    padding: '0.7rem 1.6rem',
    backgroundColor: '#10b981',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(16, 185, 129, 0.35)',
  },
};

export default SearchPage;


