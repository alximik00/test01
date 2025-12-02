namespace :cities do
  desc 'Import US city names from db/seed_data/uscities.csv (unique by name only)'
  task import: :environment do
    require 'csv'

    path = Rails.root.join('db', 'seed_data', 'uscities.csv')

    unless File.exist?(path)
      puts "File not found: #{path}"
      exit 1
    end

    puts "Importing cities from #{path}..."

    names = Set.new

    CSV.foreach(path, headers: true) do |row|
      name = row['city']&.strip
      next if name.blank?

      names << name
    end

    puts "Found #{names.size} unique city names. Inserting..."

    City.transaction do
      names.each_slice(1000) do |batch|
        now = Time.current
        values = batch.map { |name| { name:, created_at: now, updated_at: now } }
        City.insert_all(values)
      end
    end

    puts "Import complete. Total cities in DB: #{City.count}"
  end
end


