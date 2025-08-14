import { NextRequest, NextResponse } from 'next/server'

const HUBSPOT_API_BASE = 'https://api.hubapi.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, accessToken, data } = body

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 401 }
      )
    }

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }

    switch (action) {
      case 'test-connection':
        // Test the connection by fetching contacts
        const testResponse = await fetch(
          `${HUBSPOT_API_BASE}/crm/v3/objects/contacts?limit=1`,
          { headers }
        )
        
        if (!testResponse.ok) {
          const error = await testResponse.text()
          console.error('HubSpot test failed:', error)
          return NextResponse.json(
            { success: false, error: 'Invalid access token' },
            { status: 401 }
          )
        }
        
        return NextResponse.json({ success: true })

      case 'get-contacts':
        const contactsResponse = await fetch(
          `${HUBSPOT_API_BASE}/crm/v3/objects/contacts?limit=${data?.limit || 100}&properties=email,firstname,lastname,company,phone,hs_lead_status`,
          { headers }
        )
        
        if (!contactsResponse.ok) {
          throw new Error('Failed to fetch contacts')
        }
        
        const contacts = await contactsResponse.json()
        return NextResponse.json(contacts.results)

      case 'get-companies':
        const companiesResponse = await fetch(
          `${HUBSPOT_API_BASE}/crm/v3/objects/companies?limit=${data?.limit || 100}&properties=name,domain,phone,city,state,industry`,
          { headers }
        )
        
        if (!companiesResponse.ok) {
          throw new Error('Failed to fetch companies')
        }
        
        const companies = await companiesResponse.json()
        return NextResponse.json(companies.results)

      case 'get-deals':
        const dealsResponse = await fetch(
          `${HUBSPOT_API_BASE}/crm/v3/objects/deals?limit=${data?.limit || 100}&properties=dealname,amount,dealstage,closedate,hs_priority`,
          { headers }
        )
        
        if (!dealsResponse.ok) {
          throw new Error('Failed to fetch deals')
        }
        
        const deals = await dealsResponse.json()
        return NextResponse.json(deals.results)

      case 'create-company':
        const createCompanyResponse = await fetch(
          `${HUBSPOT_API_BASE}/crm/v3/objects/companies`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({ properties: data.company })
          }
        )
        
        if (!createCompanyResponse.ok) {
          const error = await createCompanyResponse.text()
          throw new Error(`Failed to create company: ${error}`)
        }
        
        const newCompany = await createCompanyResponse.json()
        return NextResponse.json(newCompany)

      case 'update-company':
        const updateCompanyResponse = await fetch(
          `${HUBSPOT_API_BASE}/crm/v3/objects/companies/${data.companyId}`,
          {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ properties: data.company })
          }
        )
        
        if (!updateCompanyResponse.ok) {
          throw new Error('Failed to update company')
        }
        
        const updatedCompany = await updateCompanyResponse.json()
        return NextResponse.json(updatedCompany)

      case 'search-company':
        const searchResponse = await fetch(
          `${HUBSPOT_API_BASE}/crm/v3/objects/companies/search`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              filterGroups: [{
                filters: [{
                  propertyName: 'name',
                  operator: 'EQ',
                  value: data.name
                }]
              }]
            })
          }
        )
        
        if (!searchResponse.ok) {
          throw new Error('Failed to search companies')
        }
        
        const searchResults = await searchResponse.json()
        return NextResponse.json(searchResults)

      case 'create-deal':
        const createDealResponse = await fetch(
          `${HUBSPOT_API_BASE}/crm/v3/objects/deals`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({ 
              properties: data.deal,
              associations: data.associations || []
            })
          }
        )
        
        if (!createDealResponse.ok) {
          const error = await createDealResponse.text()
          throw new Error(`Failed to create deal: ${error}`)
        }
        
        const newDeal = await createDealResponse.json()
        return NextResponse.json(newDeal)

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('HubSpot API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
